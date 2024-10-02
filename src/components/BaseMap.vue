<template>
  <div class="map-wrapper">
    <GeoFilterView class="filter-overlay" @saveFilter="handleFilterData"></GeoFilterView>
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
<!--    <ol-vector-layer>-->
<!--      <ol-source-vector>-->
<!--        <ol-feature v-for="geometry in pointFeatures" :key="geometry.getId()">-->
<!--          <ol-geom-point :coordinates="geometry.getGeometry().getCoordinates()"/>-->
<!--          <ol-style>-->
<!--            <ol-style-circle :radius="8">-->
<!--              <ol-style-stroke color="red" :width="1"/>-->
<!--              <ol-style-fill color="rgba(0,0,0,0.2)"/>-->
<!--            </ol-style-circle>-->
<!--          </ol-style>-->
<!--        </ol-feature>-->
<!--      </ol-source-vector>-->
<!--    </ol-vector-layer>-->

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature v-for="geometry in pointFinalStar" :key="geometry.getId()">
          <ol-geom-point :coordinates="geometry.getGeometry().getCoordinates()"/>
          <ol-style v-if="geometry.values_.starPoint">
            <ol-style-icon :src="IconStartPin" :scale="0.7" :anchor="[0.5, 1]">
            </ol-style-icon>
          </ol-style>
          <ol-style v-else>
            <ol-style-icon :src="IconEndPin" :scale="0.7" :anchor="[0.5, 1]">
            </ol-style-icon>
          </ol-style>

        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature v-for="line in routeLine" :key="line.getId()">
          <ol-geom-line-string :coordinates="line.getGeometry().getCoordinates()"/>
          <ol-style>
            <ol-style-stroke color="#ec1c24" :width="5"/>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    </ol-map>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Feature} from "ol";
import {LineString, Point} from "ol/geom";
import type {GeometryPoint} from "@/components/Types";
import axios from "axios";
import {forEach} from "ol/geom/flat/segments";
import IconStartPin from "../assets/IconStartPin.png";
import IconEndPin from "../assets/IconEndPin.png";
import GeoFilterView from "@/views/GeoFilterView.vue";

//Configurações de iniciação do mapa
let center = ref([-60.457873,0.584053]); // Centro do mapa em EPSG:4326
let projection = ref("EPSG:4326");
let zoom = ref(5);

//Array com as geometrias prontas dentro de uma Feature. Diferente da pointList, aqui o objeto geometry já está dentro de objetos que o mapa utiliza.
let pointFeatures = ref([]);

let pointFinalStar = ref([]);

//Variável que armazena as geometrias do tipo LineString
let routeLine = ref([]);

function handleFilterData(filterData: { person: int | null, startDate: string | null, endDate: string | null }) {
  pointFeatures.value = []
  routeLine.value = []
  pointFinalStar.value = []
  let getUrl = 'http://localhost:8080/tracker/period/' + filterData.person + '/' + filterData.startDate + 'T00:00:00.000/' + filterData.endDate + 'T00:00:00.000?page=0'

  getAllPoints(getUrl).then(point => {
    let arrayFromDB= new ref([]);

    for (let i = 0; i < point.length; i++) {
      arrayFromDB.value.push(point[i]);
    }
    makeGeometryPointFromArray(arrayFromDB,filterData.person)
    makeLineFromPoints(pointFeatures)
  })
}


//Método que irá solicitar os pontos do backend. Lembrar de ajustar conforme o término da task de criação desse endpoint
const getAllPoints = async (getPointsUrl) => {
  try {
    let response = await axios.get(getPointsUrl);
    return response.data.content

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
    let pontoInicial = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[0].longitude,arrayOfGeometryObjects.value[0].latitude]),
    })
    pontoInicial.setId(arrayOfGeometryObjects.value[0].id)
    pontoInicial.setProperties({
      createdAt: arrayOfGeometryObjects.value[0].createdAt,
      person:
          {idPerson: nameFilter,
            code: arrayOfGeometryObjects.value[0].codeDevice},
            starPoint: true
    })

    pointFinalStar.value.push(pontoInicial);

    let pontoFinal = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length-1].longitude,arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length-1].latitude]),
    })
    pontoFinal.setId(arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length-1].id)
    pontoFinal.setProperties({
      createdAt: arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length-1].createdAt,
      person:
          {idPerson: nameFilter,
            code: arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length-1].codeDevice}})
    pointFinalStar.value.push(pontoFinal);


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
    console.log(pointFeatures);
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

</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}

.filter-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
}

:global(.ol-zoom-in) {
  bottom: 6em;
  right: 2em;
  position: fixed;
}

:global(.ol-zoom-out) {
  bottom: 4.5em;
  right: 2em;
  position: fixed;
}

</style>
