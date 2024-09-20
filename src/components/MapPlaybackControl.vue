<template>
  <div>
    <div id="map" class="map"></div>
    <div class="control-movement">
      <button class="start-and-pause" @click="startAndPause();">
        <i :class="animating ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
      </button>
      <button class="forward"><i class="fa-solid fa-forward-step"></i></button>
      <button class="backward"><i class="fa-solid fa-backward-step"></i></button>
      <button class="restart" @click="restartAnimation()"><i class="fa-solid fa-rotate-left"></i></button>
      <div class = "reproduction-bar">
        <input id="speed" type="range" min="0" :max="duration" step="0" v-model="elapsedTime" @input="adjustPosition(); pauseAnimation();">
      </div>
      <div class="date">
        <h6>19/09/2024 <br> 17:38</h6>
      </div>
    </div>
    <div class="speed-dropdown">
        <i class="fa-solid fa-gauge select-speed"></i>
        <select id="dropdown" class="dropdown-select" v-model="selectedOption" @change="typeVelocity">
          <option @click="adjustVelocity(0.5)" value="0.5x">0.5x</option>
          <option @click="adjustVelocity(1)" value="1x" selected>1x</option>
          <option @click="adjustVelocity(2)" value="2x">2x</option>
        </select> 
      </div>
  </div>
</template>

<script setup lang="ts">

import 'ol/ol.css';
import { Point, LineString } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { onMounted, ref } from 'vue';
import { Feature } from 'ol';
import { Map } from 'ol'; 
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';

let map: Map;
const vectorSource = new VectorSource();
const rotaPontos: [number, number][] = [
  [-43.1729, -22.9068], 
  [-43.2096, -22.9035],
  [-43.2066, -22.9035],
];

let animating = false;
let startTime: number;
let iconFeature: Feature;
let rota: LineString;
let isDropdownOpen = false;

const selectedOption = ref('');
const elapsedTime = ref(0);
const duration = ref(5000); 

function typeVelocity() {
  console.log(selectedOption)
  if (selectedOption.value === "0.5x") {
    if (!animating) {
      adjustVelocity(0.5);
    } else {
      pauseAnimation();
      adjustVelocity(0.5);
      continueAnimation();
    }
  } else if (selectedOption.value === "1x") {
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
  const progress = elapsedTime.value / duration.value;
  duration.value = 5000 / duracao;
  elapsedTime.value = progress * duration.value;
  isDropdownOpen = false;

  if (!animating) {
    adjustPosition();
  }
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

// funcao que anima o icone na rota tracejada
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

// função para atualizar a animação conforme ele vai andando no mapa
function adjustPosition() {
  const progress = Math.min(elapsedTime.value / duration.value, 1);
  const coord = rota.getCoordinateAt(progress);
  iconFeature.getGeometry().setCoordinates(coord);
  elapsedTime.value = progress * duration.value;
}

// função para controlar as animações
function pauseAnimation() {
  if (animating) {
    animating = false;
    elapsedTime.value = new Date().getTime() - startTime;
  }
}

function continueAnimation() {
  if (!animating) {
    initiateAnimation();
  } 
}

function restartAnimation() {
  elapsedTime.value = 0;
  initiateAnimation();
}

function initiateAnimation() {
  animating = true;
  startTime = new Date().getTime() - elapsedTime.value;
  requestAnimationFrame(routeAnimation); 
}

// função que cria o marcador no mapa

function criarIcone(comeco: [number, number]) {
  iconFeature = new Feature({
    geometry: new Point(fromLonLat(comeco)),
  });

  vectorSource.addFeature(iconFeature);

  const markerLayer = new VectorLayer({
    source: new VectorSource({
      features: [iconFeature],
    }),
    style: new Style({
      image: new Icon({
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    }),
  });

  map.addLayer(markerLayer);
}


// funções com dados mockados ##### deletar para fazer integração com banco e data
function criarRota(pontos: [number, number][]) {
  rota = new LineString(pontos.map(ponto => fromLonLat(ponto)));
  const rotaFeature = new Feature({
    geometry: rota,
  });

  const rotaLayer = new VectorLayer({
    source: new VectorSource({
      features: [rotaFeature],
    }),
  });
  
  map.addLayer(rotaLayer);
}

function createMap() {
  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([-43.1729, -22.9068]),
      zoom: 12,
    }),
  });
}
///

onMounted(() => {
  createMap();
  criarRota(rotaPontos);
  criarIcone(rotaPontos[0]);
});

</script>

<style scoped>

.speed {
  top: 50px;
}

.control-movement {
  width: 100%;
  height: 50px;
  position: absolute;
  display: flex;
  bottom: 0px;
  background: linear-gradient(rgb(50, 50, 50), rgb(0, 0, 0));
  opacity: 70%;
}

.speed-dropdown select {
  width: 30px;
  height: 30px;
  position: absolute;
  background-color: transparent;
  cursor: pointer;
  bottom: 10px;
  left: 6.5%;
  cursor: pointer;
  border: none;
  appearance: none; 
  color: transparent;
  text-emphasis-color: red;
}

.speed-dropdown option {
  color: white;
  background-color: #202020;
}

.date { 
  color: white;
  font-size: 30px;
  position: absolute;
  display: flex;
  bottom: 0px;
  left: 10%;
}

.reproduction-bar {
  width: 100%;
  height: 15px;
  position: absolute;
  display: flex;
  bottom: 40px;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: red;
  outline: none;
  border-radius: 30px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: red;
  cursor: pointer;
}

.map {
  width: 200%;
  height: 100%;
  margin-bottom: 20px;
  position: relative;
}

.select-speed {
  left: 6.5%;
}

.start-and-pause {
  left: 3%;
}

.start-and-pause, .backward, .forward, .restart, .select-speed {
  background-color: transparent;
  border: none; 
  color: white;
  font-size: 30px;
  cursor: pointer; 
  position: absolute;
  display: flex;
  bottom: 10px;
}

.backward {
  right: 8.2%;
}

.forward {
  right: 3%;
}

.restart {
  right: 5.2%;
}

</style>
