<template>
  <svg 
    width="50" 
    height="50" 
    viewBox="0 0 65 65" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    @click="toggleColor()"
  >
    <circle 
      cx="32.5" 
      cy="32.5" 
      r="32.5" 
      transform="rotate(90 32.5 32.5)" 
      :fill="circleThemeManipulator ? '#EC1C24' : '#000059'"
    />
    <path 
      d="M50 18.667C50 17.5624 49.1046 16.667 48 16.667H17C15.8954 16.667 15 17.5624 15 18.667V23.5635C15 24.0616 15.1859 24.5418 15.5213 24.9101L26.9787 37.4918C27.3141 37.8601 27.5 38.3403 27.5 38.8384V50.5894C27.5 52.2829 29.4732 53.2099 30.7767 52.1289L37.2767 46.7385C37.7349 46.3586 38 45.7943 38 45.199V38.8152C38 38.3311 38.1756 37.8634 38.4943 37.4989L49.5057 24.9031C49.8244 24.5386 50 24.0709 50 23.5867V18.667Z" 
      stroke="#EFEFEF" 
      stroke-width="3"
      :fill="pathColorManipulator ? 'transparent' : '#EFEFEF' "
      class="color-transition"
    />
  </svg>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';

const store = darkModeClick();

const pathColorManipulator = ref<boolean>(true);
const circleThemeManipulator = ref<boolean>(false);

const toggleColor = (): void => {
  pathColorManipulator.value = !pathColorManipulator.value;
};

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
