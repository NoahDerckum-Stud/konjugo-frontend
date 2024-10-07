<template>
  <template v-if="langs.length == 0">
    <div class="d-flex justify-content-center mt-5">
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </template>

  <template v-if="langs.length != 0">
    <div style="max-height: 100%">
      <h1 class="text-center mt-5">Choose a language</h1>
      <div class="d-flex m-3 mt-4 flex-wrap justify-content-center">
        <div
          v-for="entry in langs"
          @click="selectLanguage(entry)"
          style="
            border: solid 2px;
            border-radius: 0px;
            min-width: 9rem;
            max-width: 18rem;
          "
          class="custom-card flex-fill d-flex flex-column align-items-center m-2"
        >
          <div
            class="mt-4"
            style="
              width: 6rem;
              height: 6rem;
              overflow: hidden;
              border-radius: 50%;
            "
          >
            <img
              style="opacity: 0.8; width: 100%; height: 100%; object-fit: cover"
              :src="entry.imgref"
            />
          </div>
          <h2 style="color: #787878" class="my-3 mb-4">
            {{ entry.title["eng"] }}
          </h2>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { get, post } from "../services/quickFetch.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

export default {
  data() {
    return {
      langs: [],
    };
  },
  async mounted() {
    let result = await get("/api/train/languages");
    this.langs = result.body;
  },
  methods: {
    async selectLanguage(entry) {
      const settingsStore = useSettingsStore();
      let res = await post("/api/train/langdetails", {
        langiso: entry.langiso,
      });
      if (res.status == 200) {
        settingsStore.selectedLanguage = res.body;
        console.log(res.body);
        this.$router.push({ path: "/dash" });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.custom-card {
  cursor: pointer;

  transition: all 0.1s ease-in-out;
  h2,
  img {
    transition: all 0.1s ease-in-out;
  }

  border-width: 4px !important;
  border-color: transparent !important;

  &:hover {
    border-color: #787878 !important;
    padding: 0px !important;
  }

  &:hover h2 {
    color: #ddd !important;
  }

  &:hover img {
    opacity: 1 !important;
  }
}
</style>
