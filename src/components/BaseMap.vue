<template>
  <div class="map-wrapper">
    <GeoFilterView class="filter-overlay" @saveFilter="handleFilterData"></GeoFilterView>
    <ol-map :loadTilesWhileAnimating="true"
            :loadTilesWhileInteracting="true"
            class="map-container">
      <ol-view
          ref="view"
          :center="center"
          :projection="projection"
          :zoom="zoom"
      />
      <ol-tile-layer>
        <ol-source-osm/>
      </ol-tile-layer>

      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature v-for="geometry in pointFinalStar" :key="geometry.getId()">
            <ol-geom-point :coordinates="geometry.getGeometry().getCoordinates()"/>
            <ol-style v-if="geometry.values_.starPoint">
              <ol-style-icon :anchor="[0.5, 1]" :scale="0.7" :src="IconStartPin">
              </ol-style-icon>
            </ol-style>
            <ol-style v-else>
              <ol-style-icon :anchor="[0.5, 1]" :scale="0.7" :src="IconEndPin">
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
              <ol-style-stroke :width="5" color="#ec1c24"/>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

    </ol-map>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {Feature} from "ol";
import {LineString, Point} from "ol/geom";
import axios from "axios";
import IconStartPin from "../assets/IconStartPin.png";
import IconEndPin from "../assets/IconEndPin.png";
import GeoFilterView from "@/views/GeoFilterView.vue";
import {useToast} from "vue-toastification";

const toast = useToast();

let center = ref([-60.457873, 0.584053]);
let projection = ref("EPSG:4326");
let zoom = ref(5);

let pointFeatures = ref([]);

let pointFinalStar = ref([]);

let routeLine = ref([]);

function handleFilterData(filterData: { person: int | null, startDate: string | null, endDate: string | null }) {
  pointFeatures.value = []
  routeLine.value = []
  pointFinalStar.value = []
  let getUrl = 'http://localhost:8080/tracker/period/' + filterData.person + '/' + filterData.startDate + 'T00:00:00.000/' + filterData.endDate + 'T00:00:00.000?page=0'

  getAllPoints(getUrl).then(point => {
    if (point.length === 0) {
      toast.info("Nenhum ponto encontrado para o filtro selecionado.");
    } else {
      let arrayFromDB = new ref([]);
      for (let i = 0; i < point.length; i++) {
        arrayFromDB.value.push(point[i]);
      }
      makeGeometryPointFromArray(arrayFromDB, filterData.person);
      makeLineFromPoints(pointFeatures);
    }
  });
}


const getAllPoints = async (getPointsUrl) => {
  try {
    let response = await axios.get(getPointsUrl);
    let points = response.data.content;

    if (points.length === 0) {
      toast.info("Nenhum ponto encontrado para o filtro selecionado.");
    }

    return points;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar pontos. Tente novamente mais tarde.");
  }
};

function makeGeometryPointFromArray(arrayOfGeometryObjects, nameFilter?) {
  if (arrayOfGeometryObjects.length == 0) {
    return []
  }
  if (nameFilter) {
    let pontoInicial = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[0].longitude, arrayOfGeometryObjects.value[0].latitude]),
    })
    pontoInicial.setId(arrayOfGeometryObjects.value[0].id)
    pontoInicial.setProperties({
      createdAt: arrayOfGeometryObjects.value[0].createdAt,
      person:
          {
            idPerson: nameFilter,
            code: arrayOfGeometryObjects.value[0].codeDevice
          },
      starPoint: true
    })

    pointFinalStar.value.push(pontoInicial);

    let pontoFinal = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length - 1].longitude, arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length - 1].latitude]),
    })
    pontoFinal.setId(arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length - 1].id)
    pontoFinal.setProperties({
      createdAt: arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length - 1].createdAt,
      person:
          {
            idPerson: nameFilter,
            code: arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length - 1].codeDevice
          }
    })
    pointFinalStar.value.push(pontoFinal);


    for (let i = 0; i < arrayOfGeometryObjects.value.length; i++) {
      let ponto = new Feature({
        geometry: new Point([arrayOfGeometryObjects.value[i].longitude, arrayOfGeometryObjects.value[i].latitude]),
      })
      ponto.setId(arrayOfGeometryObjects.value[i].id)
      ponto.setProperties({
        createdAt: arrayOfGeometryObjects.value[i].createdAt,
        person:
            {
              idPerson: nameFilter,
              code: arrayOfGeometryObjects.value[i].codeDevice
            }
      })
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
      idText: arrayOfGeometryObjects.value[i].itoId,
    });
    pointFeatures.value.push(ponto);
  }

  return null;
}

function makeLineFromPoints(featureList) {
  if (featureList.value.length === 0) {
    console.log('Nenhum ponto disponível para criar linhas');
    toast.info("Nenhum ponto disponível para criar linhas.");
    return null;
  }

  const groupedByItoId = featureList.value.reduce((acc, feature) => {
    const idText = feature.get('idText');
    if (!acc[idText]) {
      acc[idText] = [];
    }
    acc[idText].push(feature);
    return acc;
  }, {});

  Object.keys(groupedByItoId).forEach(idText => {
    const points = groupedByItoId[idText];
    const pointsLength = points.length;

    console.log(`Criando linhas para idText: ${idText} com ${pointsLength} pontos`);

    if (pointsLength >= 2) {
      for (let i = 0; i < pointsLength - 1; i++) {
        const point1 = points[i];
        const point2 = points[i + 1];

        if (point1.get('person').idPerson === point2.get('person').idPerson) {
          let newRoute = new Feature({
            geometry: new LineString([
              point1.getGeometry().getCoordinates(),
              point2.getGeometry().getCoordinates(),
            ]),
          });
          newRoute.setProperties({idPerson: point1.get('person').idPerson});

          if (routeLine.value.length > 0) {
            if (routeLine.value[routeLine.value.length - 1].get('idPerson') === newRoute.get('idPerson')) {
              let routeLinker = new Feature({
                geometry: new LineString([
                  routeLine.value[routeLine.value.length - 1].getGeometry().getCoordinates()[1],
                  newRoute.getGeometry().getCoordinates()[0],
                ]),
              });
              routeLinker.setProperties({idPerson: point1.get('person').idPerson});
              routeLine.value.push(routeLinker);
            }
          }

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
