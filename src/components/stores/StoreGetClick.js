import { defineStore } from 'pinia';

export const getClick = defineStore('getClick', {
  state () {
    return {
      onClickFilters: false
    }
  },
  actions: {
    onClickToggleFilters() {
      this.onClickFilters = !this.onClickFilters;
    },
  },
});