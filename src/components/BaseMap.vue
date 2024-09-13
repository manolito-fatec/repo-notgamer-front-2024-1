<template>
  <ol-map class="map-container"
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true">
    <ol-view
        ref="view"
        :center="center"
        :zoom="zoom"
        :projection="projection"
    />
    <ol-tile-layer>
      <ol-source-osm/>
    </ol-tile-layer>
    <!-- Início da Layer -->
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature v-for="geometry in pointFeatures" :key="geometry.getId()">
          <ol-geom-point :coordinates="geometry.getGeometry().getCoordinates()"/>
          <ol-style>
            <ol-style-circle :radius="8">
              <ol-style-stroke color="red" :width="1"/>
              <ol-style-fill color="rgba(0,0,0,0.2)"/>
            </ol-style-circle>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
    <!-- Fim da Layer -->
  </ol-map>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Feature} from "ol";
import {Point} from "ol/geom";
const center = ref([-60.457873,0.584053]); // Centro do mapa em EPSG:4326
const projection = ref("EPSG:4326");
const zoom = ref(5);

const pointFeatures = ref([]);

//Função que
function addPoint(coordenadas) {
  const pointFeature = new Feature({
    geometry: new Point(coordenadas)
  });
  // Adiciona a Feature à lista de pontos
  pointFeatures.value.push(pointFeature);
}

onMounted(() => {
addPoint([-60.66744123,2.841927493])
addPoint([-60.68858993,2.832449611])
addPoint([-60.6890344,2.8330745])
addPoint([-60.68875233,2.832707898])


  // for (let i = 0; i < pointFeatures.value.length; i++) {
  //   console.log(pointFeatures.value[i].getGeometry().getCoordinates());
  // }
});
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}
:global(.ol-zoom-in) {
  bottom: 6em;
  right: 2em;
  position: fixed;
}

:global(.ol-zoom-out) {
  bottom: 4.5em;
  right: 2em;
  position:fixed;
}
</style>
