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
            <ol-style-stroke color="blue" :width="5"/>
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
import axios from "axios";
import {forEach} from "ol/geom/flat/segments";

//Configurações de iniciação do mapa
let center = ref([-60.457873,0.584053]); // Centro do mapa em EPSG:4326
let projection = ref("EPSG:4326");
let zoom = ref(5);

//Array com as geometrias prontas dentro de uma Feature. Diferente da pointList, aqui o objeto geometry já está dentro de objetos que o mapa utiliza.
let pointFeatures = ref([]);

//Array com objetos do tipo GeometryPoint. É a lista inicial de pontos, vindos do endpoint.
let pointList = ref<GeometryPoint[]>([]);

//Variável que armazena as geometrias do tipo LineString
let routeLine = ref([]);


//Método que irá solicitar os pontos do backend. Lembrar de ajustar conforme o término da task de criação desse endpoint
const getAllPoints = async () => {
  try {
    let response = await axios.get("http://localhost:8080/tracker/period/2/2024-01-13T00:00:00/2024-09-09T23:59:59")
    return response.data

  } catch (error) {
      console.log(error);
  }
}

//Prepara as coordenadas para serem lidas pelo mapa.
//Feature é um objeto legível pela tag 'ol-feature'. Define como a layer se comporta.
//Dentro da Feature, estamos inserindo o Point, objeto que contém as coordenadas (longitude,latitude).
//A Feature permite inserir mais atributos para um ponto, podendo inserir dados personalizados (como nome, data, etc). Também podemos inserir o estilo do ponto por aqui.
function makeGeometryPointFromArray(arrayOfGeometryObjects, nameFilter?) {
  console.log(arrayOfGeometryObjects.length);
  if (arrayOfGeometryObjects.length == 0) {
    return []
  }
  // if (nameFilter) {
  //   for (let i = 0; i < arrayOfGeometryObjects.value.length; i++) {
  //     if (arrayOfGeometryObjects.value[i].person.fullName === nameFilter._value) {
  //       let ponto = new Feature({
  //         geometry: new Point([arrayOfGeometryObjects.value[i].longitude,arrayOfGeometryObjects.value[i].latitude]),
  //       })
  //       ponto.setId(arrayOfGeometryObjects.value[i].id)
  //       ponto.setProperties({createdAt: arrayOfGeometryObjects.value[i].createdAt, person: {fullName: arrayOfGeometryObjects.value[i].person.fullName, code: arrayOfGeometryObjects.value[i].codeDevice}})
  //       pointFeatures.value.push(ponto);
  //     }
  //     }
  //   return null;
  // }
  for (let i = 0; i < arrayOfGeometryObjects.value.length; i++) {
    let ponto = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[i].longitude,arrayOfGeometryObjects.value[i].latitude]),
    })
    console.log(arrayOfGeometryObjects.value[i]);
    console.log(arrayOfGeometryObjects.value[i]);
    ponto.setId(arrayOfGeometryObjects.value[i].id)
    ponto.setProperties({createdAt: arrayOfGeometryObjects.value[i].createdAt})
    pointFeatures.value.push(ponto);
  }
  return null
}

//Função responsável por criar as rotas no mapa. Objetivamente falando, cria um objeto LineString baseado em dois
// objetos Point presentes na lista iterada pelo mapa.
//Cada verificação lógica do tamanho da lista é verificado para garantir que as linhas sejam criadas.
function makeLineFromPoints(featureList) {
  if (featureList.value.length != 0) {
    const pointsLength = featureList._value.length;

    // Verifica se o número de pontos é par
    if (pointsLength % 2 === 0) {
      // Percorre a lista de pontos de 2 em 2
      for (let i = 0; i < pointsLength; i += 2) {
        let newRoute = new Feature({
          geometry: new LineString([
            featureList._value[i].values_.geometry.getCoordinates(),
            featureList._value[i + 1].values_.geometry.getCoordinates(),
          ]),
        });

        // Conectar a última rota com a nova
        if (routeLine._value.length > 0) {
          let routeLinker = new Feature({
            geometry: new LineString([
              routeLine._value[routeLine._value.length - 1].values_.geometry.getCoordinates()[1],
              newRoute.values_.geometry.getCoordinates()[0],
            ]),
          });
          routeLine.value.push(routeLinker);
        }
        // Adiciona a nova rota ao routeLine
        routeLine.value.push(newRoute);
      }
    }
    // Verifica se o número de pontos é ímpar e maior ou igual a 3
    else if (pointsLength >= 3 && pointsLength % 2 === 1) {
      // Percorre os pares e faz as conexões
      for (let i = 0; i < pointsLength - 1; i += 2) {
        let newRoute = new Feature({
          geometry: new LineString([
            featureList._value[i].values_.geometry.getCoordinates(),
            featureList._value[i + 1].values_.geometry.getCoordinates(),
          ]),
        });

        // Conecta com a rota anterior, se houver
        if (routeLine._value.length > 0) {
          let routeLinker = new Feature({
            geometry: new LineString([
              routeLine._value[routeLine._value.length - 1].values_.geometry.getCoordinates()[1],
              newRoute.values_.geometry.getCoordinates()[0],
            ]),
          });
          routeLine.value.push(routeLinker);
        }
        // Adiciona a nova rota ao routeLine
        routeLine.value.push(newRoute);
      }

      // Ponto ímpar: conecta o último ponto que "sobrou" à última rota
      let lastPoint = featureList._value[pointsLength - 1];
      let lastLinker = new Feature({
        geometry: new LineString([
          routeLine._value[routeLine._value.length - 1].values_.geometry.getCoordinates()[1],
          lastPoint.values_.geometry.getCoordinates(),
        ]),
      });
      routeLine.value.push(lastLinker);
    }
  }

  return null;  // A função não retorna nada de significativo
}


let filtroPorNome = ref<string>()
onMounted(() => {
  let arrayFromDB= new ref([]);
  getAllPoints().then(point => {
    for (let i = 0; i < point.length; i++) {
      arrayFromDB.value.push(point[i]);
    }
    makeGeometryPointFromArray(arrayFromDB)
    makeLineFromPoints(pointFeatures)
  })

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
