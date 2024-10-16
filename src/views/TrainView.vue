<script setup>
import AsyncContainer from "@/components/AsyncContainer.vue";
import {
  getTypeMeta,
  getPreview,
  getTagTitle,
} from "@/services/attributeParser.js";
import { useTrainSettingsStore } from "@/stores/trainSettingsStore.js";
import { post } from "@/services/quickFetch";
import { computed, onMounted, ref, toRaw } from "vue";
import { bakedComparision } from "../services/levenshteinAlgorithm.js";
import correctAnim from "../assets/svg/correctAnim.json";
import wrongAnim from "../assets/svg/wrongAnim.json";
import warningAnim from "../assets/svg/warningAnim.json";
import { useSettingsStore } from "@/stores/settingsStore.js";

const selectedLanguage = ref(undefined);
const challanges = ref(undefined);
const currentChallange = ref(0);
const currentSeconds = ref(0);
const currentInput = ref("");
const secondTimer = ref(undefined);
const currentResult = ref(undefined);
const currentAnim = ref(undefined);
const statistics = ref([]);
const summary = ref(undefined);
const statisticsPosted = ref(false);
const inputField = ref(null);
const settingsStore = useSettingsStore();
const trainSettingsStore = useTrainSettingsStore();

onMounted(async () => {
  window.addEventListener("keydown", handleEnter);
  startTimer();
  let challangesRes = await post(
    "/api/train/start_challange",
    trainSettingsStore.settings
  );
  if (challangesRes.status == 200) {
    challanges.value = challangesRes.body;
  }

  const settingsStore = useSettingsStore();

  selectedLanguage.value = settingsStore.selectedLanguage;

  if (challanges.value?.length == 0) {
    summary.value = generateSummary();
  }
});

function startTimer() {
  secondTimer.value = setInterval(() => {
    currentSeconds.value++;
  }, 1000);
}

function stopTimer() {
  clearInterval(secondTimer.value);
}

function checkResult() {
  currentResult.value = {
    input: currentInput.value,
    exptected: challanges.value[currentChallange.value].flection,
    ...bakedComparision(
      challanges.value[currentChallange.value].flection,
      currentInput.value
    ),
  };

  if (currentResult.value.levenshteinDistance == 0) {
    currentAnim.value = correctAnim;
  } else if (currentResult.value.levenshteinDistance < 1) {
    currentAnim.value = warningAnim;
  } else {
    currentAnim.value = wrongAnim;
  }

  let statistic = {
    langiso: selectedLanguage.value.langiso,
    lemma: challanges.value[currentChallange.value].lemma,
    tags: toRaw(challanges.value[currentChallange.value].tags),
    timestamp: new Date(),
    seconds: currentSeconds.value,
    levenshtein: currentResult.value.levenshteinDistance,
  };
  statistics.value.push(statistic);
  console.log(statistic);
}

function generateSummary() {
  let statisticCount = statistics.value.length;
  let levenshteinSum = 0;
  let secondsSum = 0;
  let correctSum = 0;

  for (let i = 0; i < statisticCount; i++) {
    let statistic = statistics.value[i];
    if (statistic.levenshtein == 0) {
      correctSum++;
    }
    levenshteinSum += statistic.levenshtein;
    secondsSum += statistic.seconds;
  }

  return {
    levenshteinSum: levenshteinSum,
    averageTime: secondsSum / statisticCount,
    correctSum: correctSum,
  };
}

function continueButton() {
  if (currentResult.value) {
    if (currentChallange.value == challanges.value.length - 1) {
      summary.value = generateSummary();
      postStatistics();
    } else {
      currentResult.value = undefined;
      currentAnim.value = undefined;
      currentInput.value = "";
      currentSeconds.value = 0;
      currentChallange.value++;
      setTimeout(() => {
        if (inputField.value) inputField.value.focus();
      }, 100);
      startTimer();
    }
  } else if (currentInput.value) {
    checkResult();
    stopTimer();
  }
}

function handleEnter(event) {
  if (event.key === "Enter") continueButton();
}

async function postStatistics() {
  if (statisticsPosted.value) return;

  await post("/api/stats/statistics", {
    statistics: statistics.value,
  });
  statisticsPosted.value = true;
}

const formatTime = computed(() => {
  const seconds = currentSeconds.value;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
});

const getResultCharClass = computed(() => (role) => {
  switch (role) {
    case "normal":
      return "";
      break;
    case "insertion":
      return "text-secondary text-decoration-line-through";
      break;
    case "deletion":
      return "text-danger";
      break;
    case "substitution":
      return "text-primary";
      break;
  }
  return "";
});
</script>

<template>
  <AsyncContainer class="h-100" :asyncValue="challanges">
    <template v-if="!summary">
      <div class="h-100 d-flex flex-column">
        <div class="d-flex justify-content-center" style="height: 10%">
          <div class="d-flex w-100 justify-content-center my-auto mx-0">
            <h3>Spanish</h3>
            <h3 class="mx-5">
              {{ currentChallange + 1 }} / {{ challanges.length }}
            </h3>
            <h3>{{ formatTime }}</h3>
          </div>
        </div>
        <div class="d-flex justify-content-center" style="height: 20%">
          <div class="d-flex flex-column justify-content-center">
            <h1 class="text-center">
              {{ challanges[currentChallange].lemma }}
            </h1>
            <h2 class="mx-auto mt-1">
              <span
                class="badge rounded-pill py-1 px-3"
                :class="`bg-${
                  getTypeMeta(challanges[currentChallange].type).color
                }`"
                >{{
                  getTypeMeta(challanges[currentChallange].type).written
                }}</span
              >
            </h2>
          </div>
        </div>

        <div class="d-flex justify-content-center" style="height: 20%">
          <div class="d-flex flex-column justify-content-center">
            <h2
              class="mx-auto mt-1"
              v-for="tag in challanges[currentChallange].tags"
            >
              <span class="badge bg-secondary rounded-pill bg-success">{{
                getTagTitle(selectedLanguage, tag, settingsStore.langiso)
              }}</span>
            </h2>
          </div>
        </div>

        <div
          class="d-flex justify-content-center"
          style="transition: all 0.5s ease-in-out"
          :style="currentAnim ? 'height: 20%;' : 'height: 0%;'"
        >
          <Vue3Lottie
            v-if="currentAnim"
            class="my-auto"
            :animationData="currentAnim"
            height="90%"
            :speed="0.8"
            :loop="false"
          />
        </div>

        <div class="d-flex justify-content-center w-100 flex-grow-1" style="">
          <div
            class="d-flex flex-column justify-content-center w-100"
            style="max-width: 464px"
          >
            <template v-if="!currentResult">
              <input
                v-model="currentInput"
                type="text"
                class="text-center input-field w-100"
                :placeholder="
                  getPreview(
                    selectedLanguage,
                    challanges[currentChallange].tags
                  )
                "
                style="font-size: 2rem"
                ref="inputField"
              />
            </template>

            <template v-if="currentResult">
              <div class="d-flex flex-column">
                <div class="d-flex mx-auto">
                  <h1>{{ currentResult.input }}</h1>
                  <h1 class="mx-4">></h1>
                  <div class="d-flex">
                    <h1
                      v-for="char in currentResult.result"
                      :class="getResultCharClass(char.type)"
                    >
                      {{ char.char == " " ? "_" : char.char }}
                    </h1>
                  </div>
                </div>
                <h4 class="text-center mb-2 text-muted">
                  ({{ currentResult.exptected }})
                </h4>
                <h3
                  class="mx-auto"
                  :class="
                    currentResult.levenshteinDistance == 0
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  {{
                    currentResult.levenshteinDistance == 0
                      ? "Excellent!"
                      : `+ ${currentResult.levenshteinDistance} error points`
                  }}
                </h3>
              </div>
            </template>
          </div>
        </div>
        <div class="d-flex justify-content-center" style="height: 10%">
          <div
            class="d-flex flex-column justify-content-center w-100"
            style="max-width: 464px"
          >
            <button
              v-on:click="() => continueButton()"
              class="btn btn-outline-primary w-100"
              style="font-size: 1.5rem"
            >
              {{ currentResult ? "Next" : "Check" }}
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-if="summary && challanges?.length != 0">
      <div class="h-100 d-flex flex-column">
        <div class="d-flex flex-column my-auto mx-auto">
          <h1 class="text-center">Summary</h1>
          <h2 class="text-center mt-5">
            Error points: {{ summary.levenshteinSum }}
          </h2>
          <h2 class="text-center">
            Average time: {{ summary.averageTime }} seconds
          </h2>
          <h2 class="text-center">
            Correct: {{ summary.correctSum }} / {{ challanges.length }}
          </h2>

          <button
            class="btn mt-5 btn-lg btn-outline-success"
            @click="
              $router.push({
                path: '/dash',
                query: { lang: selectedLanguage.langiso },
              })
            "
          >
            Finish
          </button>
        </div>
      </div>
    </template>
    <template v-if="summary && challanges?.length == 0">
      <div class="h-100 d-flex flex-column">
        <div class="d-flex flex-column my-auto mx-auto">
          <h1 class="text-center">Summary</h1>
          <h2 class="text-center mt-5">No Samples fetched.</h2>

          <button
            class="btn mt-5 btn-lg btn-outline-success"
            @click="
              $router.push({
                path: '/dash',
                query: { lang: selectedLanguage.langiso },
              })
            "
          >
            Finish
          </button>
        </div>
      </div>
    </template>
  </AsyncContainer>
</template>

<style>
.input-field {
  background-color: transparent;
  border-left: 0px solid;
  border-top: 0px solid;
  border-right: 0px solid;
  border-bottom: 3px solid;
}

.input-field:focus {
  outline: none;
}
</style>
