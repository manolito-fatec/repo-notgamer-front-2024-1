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

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature v-for="line in routeLine" :key="line.getId()">
          <ol-geom-line-string :coordinates="line.getGeometry().getCoordinates()"/>
          <ol-style>
            <ol-style-stroke color="blue" :width="2"/>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

  </ol-map>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Feature} from "ol";
import {LineString, Point} from "ol/geom";
import type {GeometryPoint} from "@/components/Types";

//Configurações de iniciação do mapa
let center = ref([-60.457873,0.584053]); // Centro do mapa em EPSG:4326
let projection = ref("EPSG:4326");
let zoom = ref(5);

//Array com as geometrias prontas dentro de uma Feature. Diferente da pointList, aqui o objeto geometry já está dentro de objetos que o mapa utiliza.
let pointFeatures = ref([]);

//Array com objetos do tipo GeometryPoint. É a lista inicial de pontos, vindos do endpoint.
let pointList = ref<GeometryPoint[]>([]);

let pointListOrderedByTime = ref([]);

//Variável que armazena as geometrias do tipo LineString
let routeLine = ref([]);

//Método que irá solicitar os pontos do backend. Lembrar de ajustar conforme o término da task de criação desse endpoint
const getAllPoints = async () => {
  try {
    const response = await api.get(`/ENDPOINT QUE PEGA TODOS OS POINTS}`)
    return response.data

  } catch (error) {

  }
}

function makeLineFromPoints(featureList){
  for (let i = 0; i < 10; i+2) {
    let newRoute = new Feature({
      geometry: new LineString([featureList._value[i].values_.geometry.getCoordinates(), featureList._value[i+1].values_.geometry.getCoordinates()]),
    });
    routeLine.value.push(newRoute);

  }
  return null;

}
onMounted(() => {
  //Popula a lista com objetos GeometryPoint mockados.
  pointList = ref([
    { id: 1, createTime: "2023-09-01T10:00:00", long: -60.457873, lat: 0.584053 },
    { id: 2, createTime: "2023-09-01T10:05:00", long: -60.457500, lat: 0.584500 },
    { id: 3, createTime: "2023-09-01T10:10:00", long: -60.456873, lat: 0.585000 },
    { id: 4, createTime: "2023-09-01T10:15:00", long: -60.456999, lat: 0.585000 },
  ]);

  //Prepara as coordenadas para serem lidas pelo mapa.
  //Feature é um objeto legível pela tag 'ol-feature'. Define como a layer se comporta.
  //Dentro da Feature, estamos inserindo o Point, objeto que contém as coordenadas (long,lat).
  //A Feature permite inserir mais atributos para um ponto, podendo inserir dados personalizados (como nome, data, etc). Também podemos inserir o estilo do ponto por aqui.
  for (let i = 0; i < pointList.value.length; i++) {
    let ponto = new Feature({
      geometry: new Point([pointList.value[i].long,pointList.value[i].lat]),
    })
    ponto.setId(pointList.value[i].id)
    ponto.setProperties({hora: pointList.value[i].createTime})
    pointFeatures.value.push(ponto);
  }

  //Lógica para exibir nos logs como os objetos de geometria estão.
  // for (let i = 0; i < pointFeatures.value.length; i++) {
  //   console.log(pointFeatures.value[i].getGeometry().getCoordinates());
  // }

  makeLineFromPoints(pointFeatures)
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
