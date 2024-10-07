<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
</script>

<template>
  <div class="container">
    <NavigationBar />
    <div class="row">
      <div class="col-12 col-md-8">
        <h3 class="mb-2 mt-2">Story</h3>
        <textarea v-model="storyInput" class="form-control"></textarea>
      </div>
      <div class="col-12 col-md-4">
        <h3 class="mb-2 mt-2">Datails</h3>
        <div class="d-flex flex-column">
          <div class="input-group mb-2">
            <span class="input-group-text">Title</span>
            <input v-model="titleInput" type="text" class="form-control" />
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text">Description</span>
            <textarea
              v-model="descriptionInput"
              type="text"
              class="form-control"
            />
          </div>
          <div class="btn-group" role="group">
            <input
              type="checkbox"
              class="btn-check"
              id="typecheck1"
              autocomplete="off"
              :checked="typeChecked('V')"
              @click="() => toggleTypes('V')"
            />
            <label class="btn btn-outline-primary" for="typecheck1"
              >Verbs</label
            >

            <input
              type="checkbox"
              class="btn-check"
              id="typecheck2"
              autocomplete="off"
              :checked="typeChecked('ADJ')"
              @click="() => toggleTypes('ADJ')"
            />
            <label class="btn btn-outline-primary" for="typecheck2"
              >Adjectives</label
            >

            <input
              type="checkbox"
              class="btn-check"
              id="typecheck3"
              autocomplete="off"
              :checked="typeChecked('N')"
              @click="() => toggleTypes('N')"
            />
            <label class="btn btn-outline-primary" for="typecheck3"
              >Nouns</label
            >
          </div>
          <button
            class="btn btn-outline-primary w-100 mt-1"
            :disabled="!mayPostStory || storyPosting"
            v-on:click="() => postStory()"
          >
            Create Story
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
export default {
  data() {
    return {
      storyInput: "",
      titleInput: "",
      descriptionInput: "",
      storyPosting: false,
      types: ["V", "ADJ", "N"],
    };
  },
  methods: {
    async postStory() {
      const settingsStore = useSettingsStore();
      this.storyPosting = true;
      let res = await post("/api/stories/story", {
        title: this.titleInput,
        description: this.descriptionInput,
        story: this.storyInput,
        langiso: settingsStore.selectedLanguage.langiso,
        types: this.types,
      });
      this.$router.push("/storylib");
      this.storyPosting = false;
    },
    toggleTypes(val) {
      if (!this.types.includes(val)) {
        this.types.push(val);
      } else {
        this.types.splice(this.types.indexOf(val), 1);
      }
    },
  },
  computed: {
    mayPostStory: (state) => {
      return (
        state.titleInput.length > 5 &&
        state.descriptionInput.length > 5 &&
        state.storyInput.length > 20
      );
    },
    typeChecked: (state) => (type) => {
      return state.types.includes(type);
    },
  },
};
</script>
