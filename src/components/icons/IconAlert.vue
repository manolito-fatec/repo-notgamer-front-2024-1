<template>
  <svg width="25"
       height="65"
       viewBox="0 0 45 65"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       @click="toggleColor"
  >
    <path d="M6.87511 29.0999C7.58229 21.0174 14.3498 14.8162 22.4632 14.8162C30.5764 14.8162 37.344 21.0174 38.0512 29.0998L40.1471 53.0515H4.77942L6.87511 29.0999Z"
          :fill="pathColorManipulator ? '#EC1C24' : '#262626'"
          class="color-transition"/>
    <mask id="path-2-inside-1_303_150" fill="white">
      <path d="M2.38971 57.8309C2.38971 55.1913 4.52953 53.0515 7.16912 53.0515H37.7574C40.397 53.0515 42.5368 55.1913 42.5368 57.8309H2.38971Z"/>
    </mask>
    <path d="M2.38971 57.8309C2.38971 55.1913 4.52953 53.0515 7.16912 53.0515H37.7574C40.397 53.0515 42.5368 55.1913 42.5368 57.8309H2.38971Z" fill="white"/>
    <path d="M2.38971 53.0515H42.5368H2.38971ZM42.5368 58.8309H2.38971V57.8309C2.38971 57.4948 2.42515 57.1597 2.49545 56.8311L7.16912 56.8309H42.432C42.5013 57.1597 42.5368 57.4948 42.5368 57.8309V58.8309ZM2.38971 57.8309V53.0515V57.8309ZM42.5368 53.0515V57.8309V53.0515Z" fill="#262626" mask="url(#path-2-inside-1_303_150)"/>
    <path d="M0 62.8309C0 60.0694 2.23858 57.8309 5 57.8309H39.9265C42.6879 57.8309 44.9265 60.0694 44.9265 62.8309V65H0V62.8309Z" fill="white"/>
    <ellipse cx="34.1728" cy="36.0846" rx="3.58456" ry="3.58456" fill="white"/>
    <path d="M31.0662 0H37.7573L36.8015 31.0662H32.022L31.0662 0Z" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pathColorManipulator = ref<boolean>(true);

const toggleColor = (): void => {
  pathColorManipulator.value = !pathColorManipulator.value;
};
</script>

<style scoped>
svg {
  display: block;
}

.color-transition {
  transition: fill 0.3s ease;
}
</style>