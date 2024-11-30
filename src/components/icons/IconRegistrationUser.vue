<template>
    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="50" height="50" viewBox="0 0 65 65">
        <circle
            cx="32.5"
            cy="32.5"
            r="32.5"
            transform="rotate(90 32.5 32.5)"
            :fill="circleThemeManipulator ? '#EC1C24' : '#000059'"
        />
        <path 
            d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            stroke="#EFEFEF"
            stroke-width="1"
            transform="scale(2) translate(3, 3)"
            :fill="'transparent'"
            class="color-transition"
        />
    </svg>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';
import { getPathColorManipulatorState } from '@/components/stores/StorePathManipulation.js';

const store = darkModeClick();
const circleThemeManipulator = ref<boolean>(false);

watch(
  () => store.onClickDarkMode,
  (newValue) => {
    circleThemeManipulator.value = newValue;
  }
);

</script>

<style scoped>
svg {
  display: block;
}

.color-transition {
  transition: fill 0.5s ease;
}
</style>