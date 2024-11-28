<template>
  <div class="wrap">
    <div id="control-movement" class="control-movement">
      <ButtonStartPause
      id="button-start-pause"
      v-model="animating"
      @click="startAndPause"
      />
      <DropdownSpeed
      v-model="selectedValue"
      @change="typeVelocity"
      />
      <div class="reproduction-bar">
        <input
            id="speed"
            v-model="elapsedTime"
            :max="duration"
            min="0"
            type="range"
            @input="handleChangeColorRange"
        >
      </div>
      <ButtonRestart
          @click="restartAnimation"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'ol/ol.css';
import DropdownSpeed from '@/components/filter/DropdownSpeed.vue';
import ButtonStartPause from '@/components/ButtonStartPause.vue';
import {ref, defineProps, watch} from 'vue';
import Feature from 'ol/Feature';
import {LineString} from 'ol/geom';
import ButtonRestart from '@/components/ButtonRestart.vue';
import {Icon, Style} from 'ol/style';
import IconPositionMap from '../assets/IconPositionMap.png';
import {getClick} from '@/components/stores/StoreGetClick.js'
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'

const store = darkModeClick();
const storeFilters = getClick();
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
  anguloInicial: number,
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

    rangeInput.style.setProperty('--elapsedTime', `${percentage}%`);

    const progress = Math.min(elapsedTime.value / duration.value, 1);
    const coord = props.rota.getCoordinateAt(progress);
    props.iconMap.getGeometry().setCoordinates(coord);

  } else {

    animating.value = false;
    startTime.value = new Date().getTime() - elapsedTime.value;

    const rangeInput = document.getElementById('speed');
    const percentage = ((elapsedTime.value / duration.value) * 100) + 0.1;

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

function adjustVelocity(duracao) {
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

  if (animating.value) {
    initiateAnimation();
  }
}

watch(() => store.onClickDarkMode,
  () => {
  const controlMovement = document.getElementById('control-movement')

  if (store.onClickDarkMode){
    controlMovement.style.background = "#262626";
  } else {
    controlMovement.style.background = "#6D6D6D";
  }
});

</script>

<style scoped>

.wrap {
  display:flex;
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 0px;
  align-items: center;
  justify-content: center;
}

.control-movement {
  display: grid;
  grid-template-columns: 10% 5% 75% 10%;
  width: 750px;
  height: 50px;
  border-radius: 10px;
  background: #6D6D6D;
  justify-items: center;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.reproduction-bar {
  width: 95%;
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

</style>
