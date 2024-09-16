<template>
  <div>
    <div id="map" class="map"></div>
    <button class="start-and-pause" @click="startAndPause()">
      <i :class="animating ? 'fa fa-pause' : 'fa fa-play'"></i>
    </button>
    <input id="speed" type="range" min="0" :max="duration" step="0" v-model="elapsedTime" @input="adjustPosition(); pauseAnimation();">
    <button class="double-velocity" @click="handleButtonClick('double'); controlDoubleVelocity();" :disabled="isDoubleSpeed"><i class="fa fa-forward"></i></button>
    <button class="half-velocity" @click="handleButtonClick('half'); controlHalfVelocity();" :disabled="isHalfSpeed"><i class="fa fa-backward"></i></button>
  </div>
</template>

<script setup lang="ts">
import 'ol/ol.css';
import { Point, LineString } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { onMounted, ref, watch } from 'vue';
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

const elapsedTime = ref(0);
const duration = ref(5000); 
const isDoubleSpeed = ref(false);
const isHalfSpeed = ref(false);

function startAndPause() {
  if (animating) {
    pauseAnimation();
  } else {
    const progress = Math.min(elapsedTime.value / duration.value, 1); 

    if (progress < 1) {
      initiateAnimation();
    } else {
      restartAnimation();
    }
  }
}

function handleButtonClick(buttonType: string) {
  if (!animating) {
    if (buttonType === 'double') {
      adjustVelocity(2);
      isHalfSpeed.value = false;
      isDoubleSpeed.value = true;
    } else if (buttonType === 'half') {
      adjustVelocity(0.5);
      isHalfSpeed.value = true;
      isDoubleSpeed.value = false;
    }
  } else {
    pauseAnimation();
    if (buttonType === 'double') {
      adjustVelocity(2);
      isHalfSpeed.value = false;
      isDoubleSpeed.value = true;
    } else if (buttonType === 'half') {
      adjustVelocity(0.5);
      isHalfSpeed.value = true;
      isDoubleSpeed.value = false;
    }
    continueAnimation();
  }
}

function adjustVelocity(duracao: number) {
  const progress = elapsedTime.value / duration.value;
  duration.value = 5000 / duracao;
  elapsedTime.value = progress * duration.value;

  if (!animating) {
    adjustPosition();
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
    } else {
      initiateAnimation();
      animating = false;
      adjustVelocity(1);
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

// funções que controlam a velocidade

function controlDoubleVelocity() {
  if (!animating) {
    adjustVelocity(2);
  } else {
    pauseAnimation();
    adjustVelocity(2);
    continueAnimation();
  }
}

function controlHalfVelocity() {
  if (!animating) {
    adjustVelocity(0.5);
  } else {
    pauseAnimation();
    adjustVelocity(0.5);
    continueAnimation();
  }
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

.half-velocity:disabled {
  background: gray;
}

.double-velocity:disabled {
  background: gray;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 80%;
  height: 8px;
  background: #ff0000;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: red;
  cursor: pointer;
}

.map {
  width: 750px;
  height: 400px;
  margin-bottom: 20px;
}

.start-and-pause {
  background-color: rgb(0, 0, 0);
  border: none; 
  color: white;
  padding: 8px 12px; 
  font-size: 12px; 
  border-radius: 30px;
  cursor: pointer; 
}

.start-and-pause:hover {
  background-color: rgb(17, 17, 17);
}

.double-velocity {
  background-color: rgb(0, 0, 0);
  border: none; 
  color: white;
  padding: 8px 12px; 
  font-size: 12px; 
  border-radius: 30px;
  cursor: pointer; 
}

.half-velocity {
  background-color: rgb(0, 0, 0);
  border: none; 
  color: white;
  padding: 8px 12px; 
  font-size: 12px; 
  border-radius: 30px;
  cursor: pointer; 
}

</style>
