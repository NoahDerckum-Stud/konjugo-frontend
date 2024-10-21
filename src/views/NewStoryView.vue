<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import { post } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const settingsStore = useSettingsStore();
const storyInput = ref("");
const titleInput = ref("");
const descriptionInput = ref("");
const storyPosting = ref(false);
const types = ref(["V", "ADJ", "N"]);
const router = useRouter();
const errorMessage = ref(undefined);

async function postStory() {
  storyPosting.value = true;
  let res = await post("/api/stories/story", {
    title: titleInput.value,
    description: descriptionInput.value,
    story: storyInput.value,
    langiso: settingsStore.selectedLanguage.langiso,
    types: types.value,
  });
  storyPosting.value = false;
  if (res.status == 200) {
    router.push("/storylib");
  } else if (res.body.message) {
    errorMessage.value = res.body.message;
  }
}

function toggleTypes(val) {
  if (!types.value.includes(val)) {
    types.value.push(val);
  } else {
    types.value.splice(types.value.indexOf(val), 1);
  }
}

const mayPostStory = computed(
  () =>
    titleInput.value.length > 5 &&
    descriptionInput.value.length > 5 &&
    storyInput.value.length > 20
);

const typeChecked = computed(() => (type) => {
  return types.value.includes(type);
});
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
          <h5 v-if="errorMessage" class="text-danger mt-1">
            {{ errorMessage }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>
