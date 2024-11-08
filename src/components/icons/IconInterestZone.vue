<template>
  <svg 
    width="50" 
    height="50" 
    viewBox="0 0 65 65" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    @click="toggleColor"
  >
    <circle 
      cx="32.5" 
      cy="32.5" 
      r="32.5" 
      transform="rotate(90 32.5 32.5)" 
      :fill="circleThemeManipulator ? '#EC1C24' : '#000059'"/>
      
    <path 
      d="M35.5616 50.21L15.128 36.8832L19.8089 17.6764L51.7892 24.7533L35.5616 50.21Z" 
      stroke="#EFEFEF" 
      stroke-width="3"
      class="color-transition"
      :fill="storePathManipulation.pathColorManipulatorIconInterestZone ? 'transparent' : '#EFEFEF' "
    />
    
    <circle 
      cx="35.1631" 
      cy="48.4656" 
      r="5" 
      transform="rotate(-95.9572 35.1631 48.4656)" 
      stroke="#EFEFEF" 
      stroke-width="2"
      class="color-transition delay-bolas1"
      :fill="circleThemeManipulator ? (storePathManipulation.pathColorManipulatorIconInterestZone ? '#EC1C24' : '#EFEFEF') : (storePathManipulation.pathColorManipulatorIconInterestZone ? '#000059' : '#EFEFEF')"
    />
    
    <circle 
      cx="20.8906" 
      cy="17.5725" 
      r="5" 
      transform="rotate(-95.9572 20.8906 17.5725)" 
      stroke="#EFEFEF" 
      stroke-width="2"
      class="color-transition delay-bolas2"
      :fill="circleThemeManipulator ? (storePathManipulation.pathColorManipulatorIconInterestZone ? '#EC1C24' : '#EFEFEF') : (storePathManipulation.pathColorManipulatorIconInterestZone ? '#000059' : '#EFEFEF')"
    />
    
    <circle 
      cx="49.8867" 
      cy="25.7107" 
      r="5" 
      transform="rotate(-95.9572 49.8867 25.7107)"  
      stroke="#EFEFEF" 
      stroke-width="2"
      class="color-transition delay-bolas3"
      :fill="circleThemeManipulator ? (storePathManipulation.pathColorManipulatorIconInterestZone ? '#EC1C24' : '#EFEFEF') : (storePathManipulation.pathColorManipulatorIconInterestZone ? '#000059' : '#EFEFEF')"
    />
    
    <circle 
      cx="15.9062" 
      cy="37.3001" 
      r="5" 
      transform="rotate(-95.9572 15.9062 37.3001)" 
      stroke="#EFEFEF" 
      stroke-width="2"
      class="color-transition delay-bolas4"
      :fill="circleThemeManipulator ? (storePathManipulation.pathColorManipulatorIconInterestZone ? '#EC1C24' : '#EFEFEF') : (storePathManipulation.pathColorManipulatorIconInterestZone ? '#000059' : '#EFEFEF')"
    />
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