<script setup>
import AsyncContainer from "@/components/AsyncContainer.vue";
import { getTypeMeta } from "@/services/attributeParser.js";

const settingsStore = useSettingsStore();
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
                getAttributeTitle(tag, settingsStore.langiso)
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
                :placeholder="getPreview(challanges[currentChallange].tags)"
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

<script>
import { useTrainSettingsStore } from "@/stores/trainSettingsStore.js";
import { post } from "@/services/quickFetch";
import { toRaw } from "vue";
import { bakedComparision } from "../services/levenshteinAlgorithm.js";
import correctAnim from "../assets/svg/correctAnim.json";
import wrongAnim from "../assets/svg/wrongAnim.json";
import warningAnim from "../assets/svg/warningAnim.json";
import { useSettingsStore } from "@/stores/settingsStore.js";

export default {
  data() {
    return {
      selectedLanguage: undefined,
      challanges: undefined,
      currentChallange: 0,
      currentSeconds: 0,
      currentInput: "",
      secondTimer: undefined,
      currentResult: undefined,
      correctAnim,
      wrongAnim,
      warningAnim,
      currentAnim: undefined,
      statistics: [],
      summary: undefined,
      statisticsPosted: false,
    };
  },
  methods: {
    startTimer() {
      this.secondTimer = setInterval(() => {
        this.currentSeconds++;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.secondTimer);
    },
    checkResult() {
      this.currentResult = {
        input: this.currentInput,
        exptected: this.challanges[this.currentChallange].flection,
        ...bakedComparision(
          this.challanges[this.currentChallange].flection,
          this.currentInput
        ),
      };

      if (this.currentResult.levenshteinDistance == 0) {
        this.currentAnim = this.correctAnim;
      } else if (this.currentResult.levenshteinDistance < 1) {
        this.currentAnim = this.warningAnim;
      } else {
        this.currentAnim = this.wrongAnim;
      }

      let statistic = {
        langiso: this.selectedLanguage.langiso,
        lemma: this.challanges[this.currentChallange].lemma,
        tags: toRaw(this.challanges[this.currentChallange].tags),
        timestamp: new Date(),
        seconds: this.currentSeconds,
        levenshtein: this.currentResult.levenshteinDistance,
      };
      this.statistics.push(statistic);
      console.log(statistic);
    },
    generateSummary() {
      let statisticCount = this.statistics.length;
      let levenshteinSum = 0;
      let secondsSum = 0;
      let correctSum = 0;

      for (let i = 0; i < statisticCount; i++) {
        let statistic = this.statistics[i];
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
    },
    continueButton() {
      if (this.currentResult) {
        if (this.currentChallange == this.challanges.length - 1) {
          this.summary = this.generateSummary();
          this.postStatistics();
        } else {
          this.currentResult = undefined;
          this.currentAnim = undefined;
          this.currentInput = "";
          this.currentSeconds = 0;
          this.currentChallange++;
          setTimeout(() => {
            if (this.$refs.inputField) this.$refs.inputField.focus();
          }, 100);
          this.startTimer();
        }
      } else if (this.currentInput) {
        this.checkResult();
        this.stopTimer();
      }
    },
    handleEnter(event) {
      if (event.key === "Enter") this.continueButton();
    },
    async postStatistics() {
      if (this.statisticsPosted) return;

      await post("/api/stats/statistics", {
        statistics: this.statistics,
      });
      this.statisticsPosted = true;
    },
  },
  async mounted() {
    window.addEventListener("keydown", this.handleEnter);
    this.startTimer();
    const trainSettingsStore = useTrainSettingsStore();
    let challangesRes = await post(
      "/api/train/start_challange",
      trainSettingsStore.settings
    );
    if (challangesRes.status == 200) {
      this.challanges = challangesRes.body;
    }

    const settingsStore = useSettingsStore();

    this.selectedLanguage = settingsStore.selectedLanguage;

    if (this.challanges?.length == 0) {
      this.summary = this.generateSummary();
    }
  },
  computed: {
    getAttributeTitle: (state) => (attribute, lang) => {
      if (!state.selectedLanguage) return undefined;

      for (let i = 0; i < state.selectedLanguage.groups.length; i++) {
        let currentGroup = state.selectedLanguage.groups[i];
        for (let j = 0; j < currentGroup.tags.length; j++) {
          let currentSegment = currentGroup.tags[j];
          if (currentSegment.id == attribute) {
            return currentSegment.title[lang];
          }
        }
      }
      return undefined;
    },
    getPreview: (state) => (attributes) => {
      if (!state.selectedLanguage) return undefined;

      for (let i = 0; i < state.selectedLanguage.groups.length; i++) {
        let currentGroup = state.selectedLanguage.groups[i];
        for (let j = 0; j < currentGroup.tags.length; j++) {
          let currentSegment = currentGroup.tags[j];
          if (
            currentSegment.preview &&
            attributes.includes(currentSegment.tag)
          ) {
            return currentSegment.preview;
          }
        }
      }
      return undefined;
    },
    formatTime: (state) => {
      const seconds = state.currentSeconds;

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(remainingSeconds).padStart(2, "0");

      return `${formattedMinutes}:${formattedSeconds}`;
    },
    getResultCharClass: (state) => (role) => {
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
    },
  },
};
</script>

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
