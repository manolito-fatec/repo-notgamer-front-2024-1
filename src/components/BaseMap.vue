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
<!--      <ol-source-xyz-->
<!--          url="https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"-->
<!--          attributions="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"-->
<!--      />-->
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

//Variável que armazena as geometrias do tipo LineString
let routeLine = ref([]);

let personId = ref();


//Método que irá solicitar os pontos do backend. Lembrar de ajustar conforme o término da task de criação desse endpoint
const getAllPoints = async () => {
  try {
    let response = await axios.get("http://localhost:8080/tracker/period/1/2024-06-01T03:00:00.000/2024-06-18T21:15:00.000")
    return response.data

  } catch (error) {
      console.log(error);
  }
}

const getAllPoints2 = async () => {
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
  if (arrayOfGeometryObjects.length == 0) {
    return []
  }
  if (nameFilter) {
    for (let i = 0; i < arrayOfGeometryObjects.value.length; i++) {
        let ponto = new Feature({
          geometry: new Point([arrayOfGeometryObjects.value[i].longitude,arrayOfGeometryObjects.value[i].latitude]),
        })
        ponto.setId(arrayOfGeometryObjects.value[i].id)
        ponto.setProperties({
          createdAt: arrayOfGeometryObjects.value[i].createdAt,
          person:
              {idPerson: nameFilter,
                code: arrayOfGeometryObjects.value[i].codeDevice}})
        pointFeatures.value.push(ponto);
      }
    return null;
  }
  for (let i = 0; i < arrayOfGeometryObjects.value.length; i++) {
    let ponto = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[i].longitude, arrayOfGeometryObjects.value[i].latitude]),
    });
    ponto.setId(arrayOfGeometryObjects.value[i].id);
    ponto.setProperties({
      createdAt: arrayOfGeometryObjects.value[i].createdAt,
      idText: arrayOfGeometryObjects.value[i].itoId, // Adiciona itoId como uma propriedade da Feature
    });
    pointFeatures.value.push(ponto);
  }

  return null;
}

//Função responsável por criar as rotas no mapa. Objetivamente falando, cria um objeto LineString baseado em dois
// objetos Point presentes na lista iterada pelo mapa.
//Cada verificação lógica do tamanho da lista é verificado para garantir que as linhas sejam criadas.
function makeLineFromPoints(featureList) {
  if (featureList.value.length === 0) {
    console.log('Nenhum ponto disponível para criar linhas');
    return null;
  }

  // Agrupando os pontos por 'idText' (ou 'itoId')
  const groupedByItoId = featureList.value.reduce((acc, feature) => {
    const idText = feature.get('idText');  // Obtém o 'idText' da feature
    if (!acc[idText]) {
      acc[idText] = [];
    }
    acc[idText].push(feature);
    return acc;
  }, {});

  // Percorre cada grupo de 'idText' e cria linhas
  Object.keys(groupedByItoId).forEach(idText => {
    const points = groupedByItoId[idText];
    const pointsLength = points.length;

    console.log(`Criando linhas para idText: ${idText} com ${pointsLength} pontos`);

    // Cria linhas apenas se houver pelo menos 2 pontos no grupo
    if (pointsLength >= 2) {
      for (let i = 0; i < pointsLength - 1; i++) {
        const point1 = points[i];
        const point2 = points[i + 1];

        // Verifica se o idPerson do ponto atual e o próximo são os mesmos
        if (point1.get('person').idPerson === point2.get('person').idPerson) {
          let newRoute = new Feature({
            geometry: new LineString([
              point1.getGeometry().getCoordinates(),
              point2.getGeometry().getCoordinates(),
            ]),
          });
          newRoute.setProperties({ idPerson: point1.get('person').idPerson });

          // Conectar a última rota com a nova apenas se o 'idPerson' for igual
          if (routeLine.value.length > 0) {
            if (routeLine.value[routeLine.value.length - 1].get('idPerson') === newRoute.get('idPerson')) {
              let routeLinker = new Feature({
                geometry: new LineString([
                  routeLine.value[routeLine.value.length - 1].getGeometry().getCoordinates()[1],
                  newRoute.getGeometry().getCoordinates()[0],
                ]),
              });
              routeLinker.setProperties({ idPerson: point1.get('person').idPerson });
              routeLine.value.push(routeLinker);
            }
          }

          // Adiciona a nova rota ao routeLine
          routeLine.value.push(newRoute);
        }
      }
    }
  });

  console.log('Linhas criadas:', routeLine.value);
  return null;
}


onMounted(() => {
  getAllPoints().then(point => {
    let arrayFromDB= new ref([]);
    for (let i = 0; i < point.length; i++) {
      arrayFromDB.value.push(point[i]);
      arrayFromDB.value.sort((a, b) => a.createdAt - b.createdAt);
    }
    makeGeometryPointFromArray(arrayFromDB,1)
  })

  getAllPoints2().then(point => {
    let arrayFromDb_= new ref([]);
    personId.value = 2;
    for (let i = 0; i < point.length; i++) {
      arrayFromDb_.value.push(point[i]);
      arrayFromDb_.value.sort((a, b) => a.createdAt - b.createdAt);
    }
    makeGeometryPointFromArray(arrayFromDb_,2)
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
