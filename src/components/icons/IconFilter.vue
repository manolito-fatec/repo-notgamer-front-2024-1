<template>
  <svg
      width="70"
      height="66"
      viewBox="0 0 100 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
  >
    <path
        d="M6.77676 58.1252C4.86242 56.2109 4.86242 53.1072 6.77676 51.1928L31.0402 26.9293L37.9726 33.8618L13.7092 58.1252C11.7948 60.0396 8.69109 60.0396 6.77676 58.1252Z"
        :fill="isActive ? '#FFF' : '#EC1C24'"
        class="color-transition"
    />
    <path
        d="M63.1373 30.0826L87.4007 5.81917C89.3151 3.90484 92.4188 3.90484 94.3332 5.81917C96.2475 7.73351 96.2475 10.8373 94.3332 12.7516L70.0697 37.0151L63.1373 30.0826Z"
        :fill="isActive ? '#FFF' : '#EC1C24'"
        class="color-transition"
    />
    <rect
        x="30.9804"
        y="27.0588"
        width="39.2157"
        height="9.80392"
        :fill="isActive ? '#FFF' : '#EC1C24'"
        class="color-transition"
    />
    <path
        d="M27.8498 34.8246C29.3369 34.4261 30.6978 35.787 30.2993 37.2741L25.5 55.1854C25.1015 56.6725 23.2426 57.1706 22.1539 56.082L9.04194 42.97C7.95328 41.8813 8.45137 40.0224 9.93851 39.6239L27.8498 34.8246Z"
        :fill="isActive ? '#EC1C24' : '#FFF'"
        :stroke="isActive ? '#610505' : '#FFF'"
        stroke-width="2"
    />
    <ellipse
        cx="90.1961"
        cy="9.80392"
        rx="9.80392"
        ry="9.80392"
        :fill="isActive ? '#FFF' : '#EC1C24'"
        class="color-transition"
    />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{ isActive: boolean }>();
</script>

<style scoped>
svg {
  display:block;
}

.color-transition {
  transition: fill 0.3s ease;
}
</style>
