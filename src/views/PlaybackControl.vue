<template>
  <div>
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
</template>

<script setup lang="ts">

import 'ol/ol.css';
import DropdownSpeed from '@/components/filter/DropdownSpeed.vue';
import ButtonStartPause from '@/components/ButtonStartPause.vue';
import BottomContainerPlayback from '@/components/BottomContainerPlayback.vue';
import { ref } from 'vue';
import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import ButtonBackward from '@/components/ButtonBackward.vue';
import ButtonForward from '@/components/ButtonForward.vue';
import ButtonRestart from '@/components/ButtonRestart.vue';

let animating = false;
let startTime: number;
let iconFeature: Feature;
let rota: LineString;

const elapsedTime = ref(0);
const duration = ref(10000);
const selectedValue = ref('1x');
const emit = defineEmits(['playback']);

function continueAnimation() {
  if (!animating) {
    initiateAnimation();
  } 
}

function typeVelocity() {
  console.log(selectedValue.value)
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

</script>

<style scoped>

.playback-control {
  position: fixed;
  width: 88.8%;
  height: 100%;
  z-index: 10;
}

</style>