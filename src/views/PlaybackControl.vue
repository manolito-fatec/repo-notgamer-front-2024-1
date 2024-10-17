<template>
  <div>
    <div class="control-movement">
      <div class = "reproduction-bar">
        <input 
        id="speed" 
        type="range" 
        min="0" 
        :max="duration" 
        v-model="elapsedTime"
        @input="handleChangeColorRange"
        >
      </div>
    <div class="date">
      <h6> 19/09/2024 <br> 17:38</h6>
    </div>
  </div>
    <ButtonBackward/>
    <ButtonForward/>
    <ButtonRestart 
      @click="restartAnimation"
    />
    <ButtonStartPause 
      v-model="animating"
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
import { nextTick, ref } from 'vue';
import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import ButtonBackward from '@/components/ButtonBackward.vue';
import ButtonForward from '@/components/ButtonForward.vue';
import ButtonRestart from '@/components/ButtonRestart.vue';
import type { Coordinate } from 'ol/coordinate';
import { Icon, Style } from 'ol/style';
import IconPositionMap from '../assets/IconPositionMap.png';

const animating = ref(false);
const startTime = ref(0);
let angulo = 0;

const elapsedTime = ref(0);
const duration = ref(30000);
const selectedValue = ref('1x');

const props = defineProps<{
  rota: LineString,
  iconMap: Feature,
  allCoordinatesAnimation: Coordinate[],
  anguloInicial: number
}>();

function getRotationIcon() {
  const coordinates = props.rota.getCoordinates();
  const progress = Math.min(elapsedTime.value / duration.value, 1);

  let currentIndex = 0;
  let accumulatedDistance = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {

    const coord1 = coordinates[i];
    const coord2 = coordinates[i + 1];

    const dist = Math.sqrt(Math.pow(coord2[0] - coord1[0], 2) + Math.pow(coord2[1] - coord1[1], 2));
    accumulatedDistance += dist;

    if (accumulatedDistance >= props.rota.getLength() * progress) {
      currentIndex = i;
      break;
    }
  }

  const currentCoord = coordinates[currentIndex];
  const nextCoord = coordinates[Math.min(currentIndex + 1, coordinates.length - 1)];

  const deltaLon = nextCoord[0] - currentCoord[0];
  const deltaLat = nextCoord[1] - currentCoord[1];

  angulo = Math.atan2(deltaLat, deltaLon) * -1;
}

function handleChangeColorRange() {
  if (!animating.value) {
    animating.value = false;
    startTime.value = new Date().getTime() - elapsedTime.value;

    const rangeInput = document.getElementById('speed');
    const percentage = ((elapsedTime.value / duration.value) * 100) + 0.1;
    
    // Update the range input's visual representation
    rangeInput.style.setProperty('--elapsedTime', `${percentage}%`);
    
    const progress = Math.min(elapsedTime.value / duration.value, 1); 
    const coord = props.rota.getCoordinateAt(progress);
    props.iconMap.getGeometry().setCoordinates(coord);
  } else {
    animating.value = false;
    startTime.value = new Date().getTime() - elapsedTime.value;

    const rangeInput = document.getElementById('speed');
    const percentage = ((elapsedTime.value / duration.value) * 100) + 0.1;
    
    // Update the range input's visual representation
    rangeInput.style.setProperty('--elapsedTime', `${percentage}%`);
    
    const progress = Math.min(elapsedTime.value / duration.value, 1); 
    const coord = props.rota.getCoordinateAt(progress);
    props.iconMap.getGeometry().setCoordinates(coord);

    continueAnimation();
  }
}

function changeColorRange() {
  const rangeInput = document.getElementById('speed');
  const percentage = ((elapsedTime.value / duration.value) * 100) + 0.1;
  rangeInput.style.setProperty('--elapsedTime', `${percentage}%`);
} 

function continueAnimation() {
  if (!animating.value) {
    initiateAnimation();
  } 
}

function typeVelocity() {
  if (selectedValue.value === "0.5x") {
    if (!animating.value) {
      adjustVelocity(0.5);
    } else {
      pauseAnimation();
      adjustVelocity(0.5);
      continueAnimation();
    }
  } else if (selectedValue.value === "1x") {
    if (!animating.value) {
      adjustVelocity(1);
    } else {
      pauseAnimation();
      adjustVelocity(1);
      continueAnimation();
    }
  } else {
    if (!animating.value) {
      adjustVelocity(2);
    } else {
      pauseAnimation();
      adjustVelocity(2);
      continueAnimation();
    }
  }
}

function adjustVelocity(duracao: number) {
  if (!animating.value) {
    const progress = elapsedTime.value / duration.value;
    duration.value = 30000 / duracao;
    elapsedTime.value = progress * duration.value;
  } else {
    pauseAnimation();
    const progress = elapsedTime.value / duration.value;
    duration.value = 30000 / duracao;
    elapsedTime.value = progress * duration.value;
    continueAnimation();
  }
  adjustPosition();
}

function startAndPause() {
  if (animating.value) {
    pauseAnimation();
  } else {
    initiateAnimation();
  }
}

function initiateAnimation() {
  animating.value = true;
  startTime.value = new Date().getTime() - elapsedTime.value;
  requestAnimationFrame(routeAnimation); 
}

function pauseAnimation() {
  if (animating.value) {
    animating.value = false;
    elapsedTime.value = (new Date().getTime() - startTime.value);
  }
}

function routeAnimation() {
  if (animating.value) {
    const progress = Math.min(elapsedTime.value / duration.value, 1); 
    elapsedTime.value = new Date().getTime() - startTime.value;

    const coord = props.rota.getCoordinateAt(progress);
    props.iconMap.getGeometry().setCoordinates(coord);

    changeColorRange();
    getRotationIcon();

    props.iconMap.setStyle(new Style({
    image: new Icon({
      src: IconPositionMap,
      anchor: [0.5, 0.5],
      scale: 0.2,
      rotation: angulo
    }),
  }));

    if (progress < 1) {
      requestAnimationFrame(routeAnimation);
    }
  }
}

function adjustPosition() {
  const progress = Math.min(elapsedTime.value / duration.value, 1);
  const coord = props.rota.getCoordinateAt(progress);
  props.iconMap.getGeometry().setCoordinates(coord);
  elapsedTime.value = progress * duration.value;

}

function restartAnimation() {
  pauseAnimation();
  elapsedTime.value = 0;
  changeColorRange();

  props.iconMap.setStyle(new Style({
    image: new Icon({
      src: IconPositionMap,
      anchor: [0.5, 0.5],
      scale: 0.2,
      rotation: props.anguloInicial
    }),
  }));

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

.reproduction-bar {
  width: 100%;
  position: absolute;
  display: flex;
  bottom: 50px;
}

.control-movement {
  width: 94.6%;
  height: 50px;
  position: fixed;
  display: flex;
  bottom: 0px;
  background: linear-gradient(rgb(50, 50, 50), rgb(0, 0, 0));
  opacity: 70%;
  left: 75px;
}

.reproduction-bar {
  width: 100%;
  position: absolute;
  display: flex;
  bottom: 50px;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  outline: none;
  border-radius: 30px;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #EC1C24 0%, #EC1C24 var(--elapsedTime), #FFFFFF var(--elapsedTime), #FFFFFF 100%);
  border-radius: 3px;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: #EC1C24;
  cursor: pointer;
  border-radius: 30px;
  margin-top: -5px; 
}

.date { 
  color: white;
  font-family: 'Poppins';
  font-size: 30px;
  position: absolute;
  display: flex;
  height: 43px;
  bottom: 0px;
  left: 140px;
}

</style>