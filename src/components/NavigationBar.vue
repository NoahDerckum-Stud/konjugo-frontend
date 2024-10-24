<script setup>
import { useSettingsStore } from "@/stores/settingsStore";
import { useRouter } from "vue-router";
const settingsStore = useSettingsStore();
const router = useRouter();
</script>

<template>
  <div class="row px-0">
    <div class="col-12">
      <div class="d-flex my-2 mt-3">
        <button
          v-if="$route.name != 'dash'"
          @click="router.back"
          class="btn my-auto me-2"
        >
          <h5 class="m-0 p-1"><</h5>
        </button>
        <div
          class="my-auto"
          style="
            width: 3rem;
            min-width: 3rem;
            height: 3rem;
            overflow: hidden;
            border-radius: 50%;
          "
        >
          <img
            style="opacity: 0.8; width: 100%; height: 100%; object-fit: cover"
            :src="settingsStore.selectedLanguage.imgref"
          />
        </div>
        <h4 class="my-auto ms-3 ms-sm-5 text-wrap text-truncate">
          {{
            settingsStore.selectedLanguage.title[
              settingsStore.selectedLanguage.langiso
            ]
          }}
          ({{ settingsStore.selectedLanguage.title["eng"] }})
        </h4>

        <router-link to="/lang" class="ms-auto btn btn-outline-light my-auto"
          ><h5 class="m-0 p-1">Select</h5></router-link
        >
      </div>
      <hr class="mb-1 mt-1" />
    </div>
  </div>
</template>
