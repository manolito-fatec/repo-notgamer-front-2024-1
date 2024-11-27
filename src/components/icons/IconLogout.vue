<template>
    <svg 
        width="50"
        height="50"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="toggleColor">
    <circle
         cx="32.5"
         cy="32.5"
         r="32.5"
         transform="rotate(90 32.5 32.5)"
         :fill="circleThemeManipulator ? '#EC1C24' : '#000059'"/>
    <mask id="path-2-inside-1_0_1" fill="white">
        <path d="M13 17C13 15.8954 13.8954 15 15 15H36C37.1046 15 38 15.8954 38 17V48C38 49.1046 37.1046 50 36 50H15C13.8954 50 13 49.1046 13 48V17Z"/>
    </mask>
        <path d="M10 17C10 14.2386 12.2386 12 15 12H36C38.7614 12 41 14.2386 41 17L35 18H16L10 17ZM38 50H13H38ZM15 50C12.2386 50 10 47.7614 10 45V17C10 14.2386 12.2386 12 15 12L16 18V48C16 49.1046 16 50 16 50H15ZM36 12C38.7614 12 41 14.2386 41 17V45C41 47.7614 38.7614 50 36 50H35C35 50 35 49.1046 35 48V18L36 12Z" fill="white" mask="url(#path-2-inside-1_0_1)"/>
        <path d="M21 18C21 17.4477 21.4477 17 22 17H36C36.5523 17 37 17.4477 37 18V48.2495C37 48.9285 36.3377 49.4101 35.6917 49.2007L21.6917 44.6637C21.2793 44.5301 21 44.1459 21 43.7124V18Z" stroke="white" stroke-width="2"/>
        <path d="M39.9393 31.9393C39.3536 32.5251 39.3536 33.4749 39.9393 34.0607L49.4853 43.6066C50.0711 44.1924 51.0208 44.1924 51.6066 43.6066C52.1924 43.0208 52.1924 42.0711 51.6066 41.4853L43.1213 33L51.6066 24.5147C52.1924 23.9289 52.1924 22.9792 51.6066 22.3934C51.0208 21.8076 50.0711 21.8076 49.4853 22.3934L39.9393 31.9393ZM59 31.5L41 31.5V34.5H59V31.5Z" fill="white"/>
    </svg>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';
import { getPathColorManipulatorState } from '@/components/stores/StorePathManipulation.js';
import { getClick } from '../stores/StoreGetClick';

const storeDarkMode = darkModeClick();
const storeGetClickToggleFilters = getClick();
const storePathManipulation = getPathColorManipulatorState();
const circleThemeManipulator = ref<boolean>(false);
const pathColorManipulator = ref<boolean>(true);

const toggleColor = (): void => {
  pathColorManipulator.value = !pathColorManipulator.value;
};

watch(
  () => storeDarkMode.onClickDarkMode,
  (newValue) => {
    circleThemeManipulator.value = newValue;
  }
)

</script>

<style scoped>
svg {
  display: block;
}

.color-transition {
  transition: fill 0.3s ease;
}

.delay-bolas2 {
  transition: fill 0.5s ease;

}

.delay-bolas4 {
  transition: fill 1s ease;

}

.delay-bolas1 {
  transition: fill 1.5s ease;
}

.delay-bolas3 {
  transition: fill 2s ease;

}

</style>