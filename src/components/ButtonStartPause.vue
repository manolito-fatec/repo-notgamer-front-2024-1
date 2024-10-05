<template>
  <button class="start-and-pause" @click="startAndPause();">
    <i :class="animating ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
  </button>
</template>

<script setup lang="ts">
import type Feature from 'ol/Feature';
import type { LineString } from 'ol/geom';
import { ref } from 'vue';


let animating = false;
let startTime: number;
let iconFeature: Feature;
let rota: LineString;

const elapsedTime = ref(0);
const duration = ref(10000);

function startAndPause() {
  if (animating) {
    pauseAnimation();
  } else {
    const progress = Math.min(elapsedTime.value / duration.value, 1); 

    if (progress < 1) {
      initiateAnimation();
    } else {
      pauseAnimation();
    }
  }
}

function initiateAnimation() {
  animating = true;
  startTime = new Date().getTime() - elapsedTime.value;
  requestAnimationFrame(routeAnimation); 
}

function pauseAnimation() {
  if (animating) {
    animating = false;
    elapsedTime.value = new Date().getTime() - startTime;
  }
}

function routeAnimation() {
  if (animating) {

    const progress = Math.min(elapsedTime.value / duration.value, 1); 
    elapsedTime.value = new Date().getTime() - startTime; 

    const coord = rota.getCoordinateAt(progress);
    iconFeature.getGeometry().setCoordinates(coord);

    if (progress < 1) {
      requestAnimationFrame(routeAnimation);
    }
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
  position: absolute;
  display: flex;
  bottom: 10px;
  left: 45px;
}
</style>