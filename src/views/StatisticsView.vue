<template>
  <div class="container">
    <NavigationBar />
    <div class="row">
      <div class="d-flex flex-wrap justify-content-evenly">
        <div v-for="group in langGroups" class="d-flex flex-column me-2">
          <div class="d-flex me-3">
            <h5 class="my-2">{{ group.header[settingsStore.langiso] }}</h5>
            <button
              v-if="group.tags.some((obj) => !obj.checked)"
              @click="group.tags.forEach((obj) => (obj.checked = true))"
              class="btn btn-outline-success ms-2 my-auto p-0 px-2"
            >
              +
            </button>
            <button
              v-if="group.tags.some((obj) => obj.checked)"
              @click="group.tags.forEach((obj) => (obj.checked = false))"
              class="btn btn-outline-danger ms-2 my-auto p-0 px-2"
            >
              -
            </button>
          </div>
          <div
            style="
              max-height: 17rem;
              overflow-y: auto;
              border: solid 2px #676767;
              border-radius: 10px;
            "
            class="me-2 flex-fill"
          >
            <ul class="list-group mx-2 my-1">
              <li
                v-for="(segment, i) in group.tags"
                class="list-group-item border-0 p-0"
              >
                <div class="m-1">
                  <input
                    class="form-check-input me-2"
                    type="checkbox"
                    v-model="segment.checked"
                    :id="`check_${segment.id}`"
                  />
                  <label
                    class="form-check-label me-2"
                    style="font-size: 1rem"
                    :for="`check_${segment.id}`"
                    >{{ segment.title[settingsStore.langiso] }}</label
                  >
                </div>
                <hr
                  v-if="i != group.tags.length - 1"
                  class="m-0"
                  style="border-width: 1px !important"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="d-flex flex-column me-2">
          <h3 class="mt-3 mb-1">Date</h3>
          <VueDatePicker
            dark="true"
            style="width: 15rem"
            range
            v-model="dateRange"
          />
          <h3 class="mt-1 mb-1">Graph</h3>
          <h6 class="mt-1 mb-1">Grouping</h6>
          <div class="btn-group" role="group">
            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btnradio1"
              autocomplete="off"
              v-model="grouping"
              :value="'daily'"
              checked
            />
            <label class="btn btn-outline-primary" for="btnradio1">Daily</label>

            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btnradio2"
              v-model="grouping"
              :value="'weekly'"
              autocomplete="off"
              selected
            />
            <label class="btn btn-outline-primary" for="btnradio2"
              >Weekly</label
            >
          </div>
          <h6 class="mt-1 mb-1">Ignore</h6>
          <div class="btn-group" role="group">
            <input
              type="checkbox"
              class="btn-check"
              id="btncheck1"
              autocomplete="off"
              :checked="ignoredGroupTypeChecked('person')"
              @click="() => toggleIngoreGroupType('person')"
            />
            <label class="btn btn-outline-primary" for="btncheck1"
              >Person</label
            >

            <input
              type="checkbox"
              class="btn-check"
              id="btncheck2"
              autocomplete="off"
              :checked="ignoredGroupTypeChecked('tense')"
              @click="() => toggleIngoreGroupType('tense')"
            />
            <label class="btn btn-outline-primary" for="btncheck2"
              >Tenses</label
            >
          </div>
          <button
            :disabled="loading"
            class="btn btn-success mt-2"
            @click="() => refreshButton()"
          >
            Refresh
          </button>
        </div>
      </div>
      <hr class="mt-3" />
    </div>
    <div class="row mb-5">
      <template v-if="!statisticsExist">
        <h3 class="text-center">No Data</h3>
      </template>
      <template v-if="statisticsExist">
        <div class="col-12 col-md-6">
          <Line
            style="min-height: 25rem"
            :options="{
              plugins: {
                title: {
                  display: true,
                  text: 'Average Levenshtein Distance',
                  font: {
                    size: 20,
                  },
                },
              },
              ...chartOptions,
            }"
            :data="levenshteinChartData"
          />
        </div>
        <div class="col-12 col-md-6">
          <Line
            style="min-height: 25rem"
            :options="{
              plugins: {
                title: {
                  display: true,
                  text: 'Average Seconds',
                  font: {
                    size: 20,
                  },
                },
              },
              ...chartOptions,
            }"
            :data="secondsChartData"
          />
        </div>
        <hr class="my-3" />
        <div class="col-md-12">
          <div class="d-flex flex-column">
            <div class="d-flex mb-2 justify-content-center">
              <button
                :disabled="page == 0 || loading"
                class="btn btn-outline-primary"
                @click="() => setPage(-1)"
              >
                <
              </button>
              <h5 class="mx-5 my-auto">Page {{ page + 1 }}</h5>
              <button
                :disabled="statistics.list.length != 20 || loading"
                class="btn btn-outline-primary"
                @click="() => setPage(1)"
              >
                >
              </button>
            </div>

            <ul class="list-group">
              <li
                v-for="stat in statistics.list"
                class="list-group-item p-1 px-2"
              >
                <div class="d-flex flex-column">
                  <div class="d-flex">
                    <p class="m-0 me-3">{{ stat.lemma }}</p>
                    <p class="m-0 me-3 text-primary">{{ stat.seconds }} s</p>
                    <p
                      class="m-0 me-3"
                      :class="levenshteinTextClass(stat.levenshtein)"
                    >
                      {{ stat.levenshtein }} ls
                    </p>
                    <p class="m-0 me-3 text-muted">
                      {{ new Date(stat.timestamp).toLocaleString() }}
                    </p>
                    <p
                      style="font-size: 0.8rem"
                      class="my-auto ms-2 text-muted"
                      v-for="(tag, i) in stat.tags"
                    >
                      {{ i == stat.tags.length - 1 ? `${tag}` : `${tag},` }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from "@/stores/settingsStore";
import { Line } from "vue-chartjs";
import NavigationBar from "@/components/NavigationBar.vue";
import { post } from "@/services/quickFetch";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const settingsStore = useSettingsStore();

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { computed, onMounted, ref } from "vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const langGroups = ref([]);
const langiso = ref(undefined);
const dateRange = ref(undefined);
const statistics = ref(undefined);
const loading = ref(false);
const page = ref(0);
const levenshteinChartData = ref({
  labels: [],
  datasets: [],
});
const secondsChartData = ref({
  labels: [],
  datasets: [],
});
const chartOptions = ref({
  responsive: true,
  spanGaps: true,
  maintainAspectRatio: false,
});
const grouping = ref("daily");
const ignoredGroupTypes = ref(["person"]);

onMounted(() => {
  const settingsStore = useSettingsStore();
  langiso.value = settingsStore.selectedLanguage.langiso;
  langGroups.value = settingsStore.selectedLanguage.groups;
  for (let i = 0; i < langGroups.value.length; i++) {
    let group = langGroups.value[i];
    for (let j = 0; j < group.tags.length; j++) {
      let segment = group.tags[j];
      segment.checked = true;
    }
  }
});

function getSelectedTags() {
  let res = [];
  for (let i = 0; i < langGroups.value.length; i++) {
    let group = langGroups.value[i];
    for (let j = 0; j < group.tags.length; j++) {
      let segment = group.tags[j];
      if (segment.checked) {
        res.push(segment.id);
      }
    }
  }
  return res;
}

function setPage(delta) {
  page.value += delta;
  refresh();
}

async function refreshButton() {
  page.value = 0;
  refresh();
}

async function refresh() {
  let settingsStore = useSettingsStore();
  loading.value = true;
  let res = await post("/api/stats/get_statistics", {
    dateRange: dateRange.value,
    attributes: getSelectedTags(),
    page: page.value,
    langiso: langiso.value,
    displayLangiso: settingsStore.langiso,
    grouping: grouping.value,
    ignoredGroupTypes: ignoredGroupTypes.value,
  });
  if (res.status == 200) {
    statistics.value = res.body;
    levenshteinChartData.value = {
      labels: statistics.value.graphData.labels,
      datasets: statistics.value.graphData.dataSets.levenshtein,
    };
    secondsChartData.value = {
      labels: statistics.value.graphData.labels,
      datasets: statistics.value.graphData.dataSets.seconds,
    };
  }
  loading.value = false;
}

function toggleIngoreGroupType(type) {
  if (!ignoredGroupTypes.value.includes(type)) {
    ignoredGroupTypes.value.push(type);
  } else {
    ignoredGroupTypes.value.splice(ignoredGroupTypes.value.indexOf(type), 1);
  }
}

const levenshteinTextClass = computed(() => (val) => {
  if (val == 0) return "text-success";
  if (val == 0.5) return "text-warning";
  return "text-danger";
});

const statisticsExist = computed(
  () => statistics.value && statistics.value?.graphData?.labels?.length > 0
);

const ignoredGroupTypeChecked = computed(
  () => (type) => ignoredGroupTypes.value.includes(type)
);
</script>
