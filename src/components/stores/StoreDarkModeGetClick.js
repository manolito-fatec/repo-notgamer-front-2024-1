import { defineStore } from 'pinia';

export const darkModeClick = defineStore('darkModeClick', {
  state () {
    return {
      onClickDarkMode: false
    }
  },
  actions: {
    onClickToggleDarkMode() {
      this.onClickDarkMode = !this.onClickDarkMode;
    },
  },
});