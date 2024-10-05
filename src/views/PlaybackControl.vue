<template>
  <div>
    <StartButton />
    <GeoFilterView @toggle-playback="togglePlayback"/>
    <div v-if="showPlayback" class="playback-control">
      <BottomContainerPlayback/>
      <ButtonBackward/>
      <ButtonForward/>
      <ButtonRestart 
        @click="restartAnimation"
      />
      <ButtonStartPause 
        @click="startAndPause"
      />
      <DropdownSpeed 
        v-model="selectedValue" 
        @change="typeVelocity"
      />
    </div> 
  </div>
</template>

<script setup lang="ts">

import 'ol/ol.css';
import DropdownSpeed from '@/components/filter/DropdownSpeed.vue';
import ButtonStartPause from '@/components/ButtonStartPause.vue';
import BottomContainerPlayback from '@/components/BottomContainerPlayback.vue';
import { computed, ref } from 'vue';
import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import ButtonBackward from '@/components/ButtonBackward.vue';
import ButtonForward from '@/components/ButtonForward.vue';
import ButtonRestart from '@/components/ButtonRestart.vue';
import GeoFilterView from './GeoFilterView.vue';

let animating = false;
let startTime: number;
let iconFeature: Feature;
let rota: LineString;

const elapsedTime = ref(0);
const duration = ref(10000);
const showPlayback = ref(false);
const selectedValue = ref('1x');

const props = defineProps({
  clickStartButton: { type: Boolean }
});

function continueAnimation() {
  if (!animating) {
    initiateAnimation();
  } 
}

function typeVelocity() {
  if (selectedValue.value === "0.5x") {
    if (!animating) {
      adjustVelocity(0.5);
    } else {
      pauseAnimation();
      adjustVelocity(0.5);
      continueAnimation();
    }
  } else if (selectedValue.value === "1x") {
    if (!animating) {
      adjustVelocity(1);
    } else {
      pauseAnimation();
      adjustVelocity(1);
      continueAnimation();
    }
  } else {
    if (!animating) {
      adjustVelocity(2);
    } else {
      pauseAnimation();
      adjustVelocity(2);
      continueAnimation();
    }
  }
}

function adjustVelocity(duracao: number) {

  if (!animating) {
    const progress = elapsedTime.value / duration.value;
    duration.value = 10000 / duracao;
    elapsedTime.value = progress * duration.value;
  } else {
    pauseAnimation();
    const progress = elapsedTime.value / duration.value;
    duration.value = 10000 / duracao;
    elapsedTime.value = progress * duration.value;
    continueAnimation();
  }
  adjustPosition();
}

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

function adjustPosition() {
  const progress = Math.min(elapsedTime.value / duration.value, 1);
  const coord = rota.getCoordinateAt(progress);
  iconFeature.getGeometry().setCoordinates(coord);
  elapsedTime.value = progress * duration.value;
}

function restartAnimation() {
  pauseAnimation();
  elapsedTime.value = 0;
  adjustPosition();
}

function togglePlayback() {
  if (showPlayback.value === false) {
    showPlayback.value = !showPlayback.value;
  } else {
    showPlayback.value = true;
  }
}

</script>

<style scoped>

.playback-control {
  position: absolute;
  width: 89.1%;
  right: 75px;
  height: 100%;
  z-index: 1;
}

</style>