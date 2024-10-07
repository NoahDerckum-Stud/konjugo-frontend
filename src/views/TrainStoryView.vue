<script setup>
import AsyncContainer from "@/components/AsyncContainer.vue";
import NavigationBar from "@/components/NavigationBar.vue";
</script>
<template>
  <AsyncContainer :asyncValue="fetchedStory">
    <div class="container">
      <NavigationBar />
      <div class="row">
        <div class="d-flex">
          <h2 class="ms-2 mt-4 text-decoration-underline">Test</h2>
          <h4 class="ms-3 mt-4 text-muted mt-auto mb-0">by jdksfafsl</h4>
        </div>
        <div class="mt-3 d-flex flex-wrap w-100 responsive-bottom">
          <div
            class="div mt-2"
            :class="element == '.' || element == ',' ? '' : 'ms-2'"
            v-for="(element, i) in fetchedStory.text"
          >
            <input
              class="text-center"
              v-model="inputs[element]"
              v-if="Number.isFinite(element)"
              :placeholder="fetchedStory.placeholders[element].lemma"
              @focus="
                (e) => onFocus(fetchedStory.placeholders[element], element, i)
              "
              @blur="(e) => onFocusLost()"
            />
            <h3 v-if="typeof element === 'string'">
              {{ element }}
            </h3>
            <div v-if="typeof element === 'object'" class="d-flex">
              <h3
                v-for="char in element.result"
                :class="getResultCharClass(char.type)"
              >
                {{ char.char }}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <hr class="mt-4" />
      <div class="details-popup p-2">
        <div class="d-flex flex-column">
          <div v-if="focusedElement" class="d-flex mb-2">
            <h3 class="my-auto">Lemma: {{ focusedElement?.element?.lemma }}</h3>
            <h4 class="ms-2 my-auto">
              <span
                v-for="tag in focusedElement?.element.tags"
                class="ms-2 badge bg-secondary rounded-pill bg-success"
                >{{ tagTitle(tag) }}</span
              >
            </h4>
          </div>
          <button
            class="btn btn-outline-primary btn-lg"
            @click="() => finishButton()"
          >
            {{ state == "done" ? "Return to menu" : "Check Results" }}
          </button>
        </div>
      </div>
    </div>
  </AsyncContainer>
</template>

<script>
import { post } from "@/services/quickFetch";
import { getTagTitle } from "../services/attributeParser.js";
import {
  bakedComparision,
  getResultCharClass,
} from "@/services/levenshteinAlgorithm.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

export default {
  data() {
    return {
      selectedLanguage: undefined,
      fetchedStory: undefined,
      focusedElement: undefined,
      inputs: {},
      state: "edit",
    };
  },
  async mounted() {
    let storyResult = await post("/api/stories/get_story", {
      id: this.$route.query.id,
    });
    if (storyResult.status == 200) {
      this.fetchedStory = storyResult.body;
    }

    const settingsStore = useSettingsStore();
    this.selectedLanguage = settingsStore.selectedLanguage;
  },
  methods: {
    onFocus(element, placeholderPos, textPos) {
      this.focusedElement = { element, placeholderPos, textPos };
    },
    onFocusLost() {
      this.focusedElement = undefined;
    },
    finishButton() {
      if (this.state == "edit") {
        this.checkResult();
      } else {
        this.$router.push("/storylib");
      }
    },
    checkResult() {
      for (let i = 0; i < this.fetchedStory.text.length; i++) {
        let word = this.fetchedStory.text[i];
        if (Number.isFinite(word)) {
          let input = this.inputs[word];
          let expected = this.fetchedStory.placeholders[word].flection;
          let result = bakedComparision(expected, input ? input : "");
          this.fetchedStory.text[i] = result;
          console.log(expected, result);
        }
      }
      this.state = "done";
    },
  },
  computed: {
    tagTitle: (state) => (tag) => {
      const settingsStore = useSettingsStore();
      return getTagTitle(state.selectedLanguage, tag, settingsStore.langiso);
    },
    getResultCharClass: (state) => (type) => {
      return getResultCharClass(type);
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
input {
  background-color: transparent;
  font-size: 1.5rem;
  line-height: 1rem;
  width: 12rem;
  border-left: 0px solid;
  border-top: 0px solid;
  border-right: 0px solid;
  border-bottom: 2px solid;
}

input {
  outline: none;
}

@media (max-width: 768px) {
  .details-popup {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: #262626;
    border-top: 2px solid white;
  }
  .responsive-bottom {
    margin-bottom: 7rem;
  }
}
</style>
