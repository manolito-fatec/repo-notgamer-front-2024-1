import { defineStore } from 'pinia';

export const getClick = defineStore('getClick', {
  state () {
    return {
      onClickFilters: false,
      onClickInterestZone: false
    }
  },
  actions: {
    onClickToggleFilters() {
      this.onClickFilters = !this.onClickFilters;
    },
    onClickToggleInterestZone() {
      this.onClickInterestZone = !this.onClickInterestZone;
    },
  },
});