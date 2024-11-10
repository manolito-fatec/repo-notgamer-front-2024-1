import { defineStore } from 'pinia';

export const getPathColorManipulatorState = defineStore('getPathColorManipulatorState', {
  state () {
    return {
        pathColorManipulatorIconFilter: true,
        pathColorManipulatorIconInterestZone: true
    }
  },
  actions: {
    onClickPathColorManipulatorIconFilter() {
      this.pathColorManipulatorIconFilter = !this.pathColorManipulatorIconFilter;
    },
    onClickPathColorManipulatorIconInterestZone() {
        this.pathColorManipulatorIconInterestZone = !this.pathColorManipulatorIconInterestZone;
    },
  },
});