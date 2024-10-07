<script setup>
import NavigationBar from "../components/NavigationBar.vue";
import AsyncContainer from "../components/AsyncContainer.vue";
import { getTypeMeta } from "@/services/attributeParser";
const settingsStore = useSettingsStore();
</script>

<template>
  <AsyncContainer :asyncValue="selectedLanguage">
    <div class="container">
      <NavigationBar />
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column">
            <div class="form-group mt-3">
              <label for="exampleInputEmail1">Search</label>
              <div class="d-flex">
                <input
                  v-model="lemmaInput"
                  @input="(event) => lemmaInputChanged(event)"
                  type="email"
                  class="form-control w-100"
                  placeholder="Lemma"
                />
                <div
                  class="btn btn-outline-success d-flex"
                  @click="() => selectedLemmas.push(previewLemmas[0])"
                  v-if="previewLemmas.length > 0"
                >
                  <h4 class="my-auto mx-3">Add</h4>
                </div>
                <div
                  class="btn btn-outline-primary d-flex"
                  @click="
                    () => {
                      fetchLemmaCollections();
                      collectionModal.show();
                    }
                  "
                >
                  <h4 class="my-auto mx-3">Collection</h4>
                </div>
              </div>
            </div>

            <div class="d-flex flex-column" style="max-width: 15rem">
              <div
                @click="addLemma(entry)"
                v-for="entry in previewLemmas"
                class="anim"
                style="border: 3px solid #78787878; border-width: 1px 3px"
              >
                <h5 class="m-1">
                  {{ entry.lemma }}
                  <span
                    class="badge rounded-pill"
                    :class="`bg-${getTypeMeta(entry.type).color}`"
                    >{{ entry.type }}</span
                  >
                </h5>
              </div>
            </div>

            <div class="d-flex flex-wrap mt-2">
              <div
                @click="removeAllSelectedLemmas()"
                v-if="selectedLemmas?.length != 0"
                class="btn btn-outline-secondary me-2 mt-2"
                style="border-width: 3px !important"
              >
                <h5>Remove All</h5>
              </div>

              <div
                @click="removeLemmaFromSelected(entry)"
                v-for="entry in selectedLemmas"
                class="btn me-2 mt-2"
                :class="`btn-outline-${getTypeMeta(entry.type).color}`"
                style="border-width: 3px !important"
              >
                <h5>{{ entry.lemma }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="mb-0" />
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column">
            <template v-if="selectedLanguage.groups">
              <h3
                v-if="selectedLemmas.length == 0"
                class="text-center mt-3 text-muted"
              >
                Please select a lemma.
              </h3>

              <div
                class="d-flex flex-column mt-3"
                v-for="group in selectedLanguage.groups"
              >
                <div v-if="showGroup(group.type)">
                  <div class="d-flex">
                    <h4>{{ group.header[settingsStore.langiso] }}</h4>
                    <button
                      v-if="group.tags.some((obj) => !obj.checked)"
                      @click="group.tags.forEach((obj) => (obj.checked = true))"
                      class="btn btn-outline-success ms-2 p-0 px-2"
                    >
                      +
                    </button>
                    <button
                      v-if="group.tags.some((obj) => obj.checked)"
                      @click="
                        group.tags.forEach((obj) => (obj.checked = false))
                      "
                      class="btn btn-outline-danger ms-2 p-0 px-2"
                    >
                      -
                    </button>
                  </div>
                  <div class="btn-group flex-wrap">
                    <template v-for="(section, i) in group.tags">
                      <input
                        type="checkbox"
                        class="btn-check"
                        :id="section.id"
                        autocomplete="off"
                        v-model="section.checked"
                        @click="console.log(section)"
                      />
                      <label
                        class="btn btn-outline-success mt-1 me-2"
                        :for="section.id"
                        >{{ section.title[settingsStore.langiso] }}
                      </label>
                    </template>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-column">
                <hr />
                <div class="d-flex mb-3">
                  <div class="input-group">
                    <span class="input-group-text">Samples</span>
                    <input
                      v-model="samplesInput"
                      type="number"
                      class="form-control"
                    />
                  </div>
                  <button
                    v-for="samplePrev in samplesPreviews"
                    class="btn px-2"
                    :class="
                      samplesInput == samplePrev
                        ? 'btn-success'
                        : 'btn-outline-success'
                    "
                    @click="() => (samplesInput = samplePrev)"
                  >
                    {{ samplePrev }}
                  </button>
                </div>

                <button
                  class="btn btn-outline-primary w-100"
                  @click="() => startLearningSession()"
                  :disabled="false"
                >
                  Start learning session
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </AsyncContainer>

  <div class="modal fade modal-xl" tabindex="-1" ref="collectionModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Lemma Library</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <AsyncContainer :asyncValue="lemmaCollections">
            <div class="d-flex">
              <div
                v-for="collection in lemmaCollections"
                class="card hover-anim"
                style="width: 18rem"
                @click="
                  () => {
                    collectionModal.hide();
                    this.selectedLemmas = collection.lemmas;
                  }
                "
              >
                <div class="card-body">
                  <h5 class="card-title">{{ collection.title }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">
                    {{ collection.lemmas.length }} Lemmas
                  </h6>
                  <p class="card-text">
                    {{ collection.description }}
                  </p>
                </div>
              </div>
            </div>
          </AsyncContainer>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.anim {
  transition: all ease-out 0.5s;
}
.anim:hover {
  background-color: black;
  cursor: pointer;
}
</style>

<script>
import { post } from "../services/quickFetch.js";
import { toRaw } from "vue";
import { useTrainSettingsStore } from "@/stores/trainSettingsStore";
import {
  bakedComparision,
  compareStrings,
  generateDiffArray,
} from "@/services/levenshteinAlgorithm";
import { Modal } from "bootstrap";
import { useSettingsStore } from "@/stores/settingsStore";

export default {
  data() {
    return {
      selectedLanguage: undefined,
      lemmaInput: "",
      samplesInput: 30,
      previewLemmas: [],
      selectedLemmas: [],
      collectionModal: undefined,
      lemmaCollections: undefined,
      samplesPreviews: [10, 20, 35, 50, 100],
    };
  },
  async mounted() {
    const settingsStore = useSettingsStore();
    this.selectedLanguage = settingsStore.selectedLanguage;
    this.collectionModal = new Modal(this.$refs.collectionModal);
    this.initSelection();
  },
  methods: {
    initSelection() {
      if (this.selectedLanguage?.groups?.length > 0) {
        for (let i = 0; i < this.selectedLanguage.groups.length; i++) {
          if (this.selectedLanguage.groups[i].type == "person")
            for (
              let j = 0;
              j < this.selectedLanguage.groups[i].tags.length;
              j++
            ) {
              this.selectedLanguage.groups[i].tags[j].checked = true;
            }
        }
        console.log(this.selectedLanguage);
      }
    },
    async lemmaInputChanged(event) {
      if (event.target.value?.length >= 2) {
        let res = await post("/api/train/lemma_preview", {
          langiso: this.selectedLanguage.langiso,
          lemma: event.target.value?.toLowerCase(),
        });
        this.previewLemmas = res.body;
        console.log(res.body);
      } else {
        this.previewLemmas = [];
      }
    },
    addLemma(lemma) {
      this.selectedLemmas.push(lemma);
      this.lemmaInput = "";
      this.previewLemmas = [];
    },
    removeLemmaFromSelected(lemma) {
      for (let i = 0; i < this.selectedLemmas.length; i++) {
        if (
          this.selectedLemmas[i]?.lemma.toLowerCase() ===
          lemma.lemma.toLowerCase()
        ) {
          this.selectedLemmas.splice(i, 1);
          i--;
        }
      }
    },
    removeAllSelectedLemmas() {
      this.selectedLemmas = [];
    },
    startLearningSession() {
      let lemmas = [];
      let tags = this.generateTagList();

      for (let lemma of this.selectedLemmas) {
        lemmas.push(lemma.lemma);
      }

      const trainSettings = {
        lemmas: lemmas,
        langiso: this.selectedLanguage.langiso,
        tags: tags,
        samples: this.samplesInput,
      };

      const trainSettingsStore = useTrainSettingsStore();
      trainSettingsStore.settings = trainSettings;

      this.$router.push("/train");
    },
    generateTagList() {
      let tags = [];
      let groups = this.selectedLanguage.groups;
      for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].tags.length; j++) {
          if (groups[i].tags[j].checked == true) {
            tags.push(groups[i].tags[j].id);
          }
        }
      }
      return tags;
    },
    async fetchLemmaCollections() {
      let result = await post("/api/train/get_lemma_collections", {
        langiso: this.selectedLanguage.langiso,
      });
      if (result.status == 200) {
        this.lemmaCollections = result.body;
      }
    },
  },
  computed: {
    blockStartButton: (state) => {
      let lemmas = toRaw(state.selectedLemmas);
      let tags = state.generateTagList();
      console.log(lemmas, tags);
      if (lemmas.length == 0 || tags.length == 0) return true;

      return false;
    },
    getTypeMeta,
    showGroup: (state) => (type) => {
      let tag = "";
      if (type == "person" || type == "tense") {
        tag = "V";
      }
      if (type == "adjective") {
        tag = "ADJ";
      }
      if (type == "substantive") {
        tag = "N";
      }
      return state.selectedLemmas.some((obj) => obj.type === tag);
    },
  },
};
</script>
