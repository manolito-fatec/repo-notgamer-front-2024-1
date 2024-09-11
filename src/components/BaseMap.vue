<template>
  <ol-map class="map-container"
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"

  >
    <ol-view
        ref="view"
        :center="center"
        :zoom="zoom"
        :projection="projection"
    />
    <ol-tile-layer>
      <ol-source-osm/>
    </ol-tile-layer>
        <!-- Camada de pontos (vetores) -->
    <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[-45.794848, -23.162259]">
            </ol-geom-point>
            <ol-style>
              <ol-style-circle :radius="20">
                <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                <ol-style-fill color="rgba(255,0,0,0.2)"></ol-style-fill>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {Icon, Style} from "ol/style";

const center = ref([-45.794848, -23.162259]);
const projection = ref("EPSG:4326");
const zoom = ref(17);

const pointFeatures = ref([]);
const pontosFinais = ref([]);

function addPoint(coordenadas) {
  const coord = coordenadas; // Exemplo de coordenada aleatória

  // Cria uma nova Feature de ponto com o texto
  const pointFeature = new Feature({
    geometry: new Point(coord)
  });
   // Adiciona a Feature à lista de pontos
  pointFeatures.value.push(pointFeature);
}

onMounted(async () => {
  addPoint([-45.794848, -23.162259])
  addPoint([-45.793728, -23.162980])
  addPoint([-45.795504, -23.161650])
  addPoint([-45.794950, -23.161240])
  addPoint([-45.793512, -23.162390])
  addPoint([-45.795218, -23.162100])
  addPoint([-45.794710, -23.163000])
  addPoint([-45.793830, -23.161890])
  addPoint([-45.795300, -23.161800])
  addPoint([-45.794670, -23.161720])
  addPoint([-45.794100, -23.162500])

  for (let i = 0; i < pointFeatures.value.length; i++) {
    console.log(pointFeatures.value[i].values_.geometry.flatCoordinates);
  }


})
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}
</style>