<template>
  <div class="map-wrapper">
    <GeoFilterView class="filter-overlay" @saveFilter="handleFilterData"></GeoFilterView>
    <div id="map" class="map-container"></div>  <!-- O mapa será montado aqui -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Map, View, Feature } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point, LineString } from 'ol/geom';
import { Icon, Style, Stroke } from 'ol/style';
import { ScaleLine } from 'ol/control';
import axios from 'axios';
import GeoFilterView from '@/views/GeoFilterView.vue';
import IconStartPin from '../assets/IconStartPin.png';
import IconEndPin from '../assets/IconEndPin.png';

let center = ref([-60.457873, 0.584053]);  // Centro do mapa
let zoom = ref(5);
let map = ref<Map | null>(null);
let pointFeatures = ref<Feature[]>([]);
let routeLine = ref<Feature[]>([]);
let pointFinalStar = ref<Feature[]>([]);

onMounted(() => {
  // Inicializa o mapa
  map.value = new Map({
    target: 'map', // ID do elemento HTML
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: center.value,
      zoom: zoom.value,
      projection: 'EPSG:4326',
    }),
  });

  // Adiciona as camadas de vetores para os pontos e as rotas
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: pointFeatures.value,
    }),
  });

  const routeLayer = new VectorLayer({
    source: new VectorSource({
      features: routeLine.value,
    }),
  });

  map.value.addLayer(vectorLayer);  // Camada de pontos
  map.value.addLayer(routeLayer);   // Camada de linhas

  // Adiciona os controles ao mapa (por exemplo, escala)
  map.value.addControl(new ScaleLine());
});

function handleFilterData(filterData: { person: number | null, startDate: string | null, endDate: string | null }) {
  // Limpa os arrays antes de adicionar novos pontos e rotas
  pointFeatures.value = [];
  routeLine.value = [];
  pointFinalStar.value = [];

  let getUrl = `http://localhost:8080/tracker/period/${filterData.person}/${filterData.startDate}T00:00:00.000/${filterData.endDate}T00:00:00.000?page=0`;

  // Pega os pontos do backend e atualiza o mapa
  getAllPoints(getUrl).then((points) => {
    let pointList = new ref(points);
    makeGeometryPointFromArray(pointList, filterData.person);
    makeLineFromPoints(pointFeatures);
  });
}

const getAllPoints = async (getPointsUrl: string) => {
  try {
    const response = await axios.get(getPointsUrl);
    return response.data.content;
  } catch (error) {
    console.error(error);
  }
};

function makeGeometryPointFromArray(arrayOfGeometryObjects, nameFilter?) {
  if (arrayOfGeometryObjects.length === 0) return [];

  if (nameFilter) {
    const startPoint = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[0].longitude, arrayOfGeometryObjects.value[0].latitude]),
    });

    startPoint.setStyle(new Style({
      image: new Icon({
        src: IconStartPin,
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    }));

    const endPoint = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length - 1].longitude, arrayOfGeometryObjects.value[arrayOfGeometryObjects.value.length - 1].latitude]),
    });

    endPoint.setStyle(new Style({
      image: new Icon({
        src: IconEndPin,
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    }));

    pointFinalStar.value.push(startPoint);
    pointFinalStar.value.push(endPoint);

    center.value = endPoint.getGeometry().getCoordinates();
  }

  arrayOfGeometryObjects.value.forEach((pointObj) => {
    const point = new Feature({
      geometry: new Point([pointObj.longitude, pointObj.latitude]),
    });
    point.setStyle(new Style({
      image: new Icon({
        src: IconEndPin,
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    }));
    pointFeatures.value.push(point);
  });
}

function makeLineFromPoints(featureList) {
  if (featureList.value.length === 0) return;

  const groupedById = featureList.value.reduce((acc, feature) => {
    const idText = feature.get('idText');
    if (!acc[idText]) acc[idText] = [];
    acc[idText].push(feature);
    return acc;
  }, {});

  Object.keys(groupedById).forEach((idText) => {
    const points = groupedById[idText];
    if (points.length >= 2) {
      for (let i = 0; i < points.length - 1; i++) {
        const point1 = points[i];
        const point2 = points[i + 1];

        const lineFeature = new Feature({
          geometry: new LineString([point1.getGeometry().getCoordinates(), point2.getGeometry().getCoordinates()]),
        });
        lineFeature.setStyle(new Style({
          stroke: new Stroke({
            color: '#ec1c24',
            width: 5,
          }),
        }));
        routeLine.value.push(lineFeature);
      }
    }
  });
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
</style>