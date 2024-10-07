import { defineStore } from "pinia";

export const useTrainSettingsStore = defineStore("trainSettings", {
  state: () => {
    return { settings: undefined };
  },
  persist: true,
});
