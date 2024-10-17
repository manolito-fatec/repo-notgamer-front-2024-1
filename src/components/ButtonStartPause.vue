<template>
  <button class="start-and-pause" @click="startAndPause">
    <i :class="animatingIcon ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const animatingIcon = ref(false);

function startAndPause() {
  if (!animatingIcon.value) {
    animatingIcon.value = true;
  } else {
    animatingIcon.value = false;
  }
}

</script>

<style>
.start-and-pause {
  background-color: transparent;
  border: none; 
  color: white;
  font-size: 30px;
  cursor: pointer; 
  position: fixed;
  display: flex;
  bottom: 10px;
  left: 118px;
}
</style>