import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return { selectedLanguage: undefined, showNativeTitles: false };
  },
  getters: {
    langiso: (state) =>
      state.showNativeTitles ? state.selectedLanguage?.langiso : "eng",
  },
  persist: true,
});
