<template>
  <div class="map-wrapper">
    <GeoFilterView class="filter-overlay" @saveFilter="handleFilterData" @clearPoints="clearPoints"/>
    <div v-if="showPlayback" class="playback-layer">
      <PlaybackControl
        v-model:rota="route" 
        v-model:iconMap="startPointIconMap"
        v-model:allCoordinatesAnimation="allCoordinatesAnimation"
        v-model:anguloInicial="anguloInicial"
      />
    </div>
    <div id="map" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Map, View, Feature } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM, XYZ } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point, LineString, Geometry } from 'ol/geom';
import { Icon, Style, Stroke } from 'ol/style';
import axios from 'axios';
import IconStartPin from '../assets/IconStartPin.png';
import IconStartAndEnd from '../assets/IconStartAndEnd.png';
import IconEndPin from '../assets/IconEndPin.png';
import GeoFilterView from "@/views/GeoFilterView.vue";
import IconPositionMap from '../assets/IconPositionMap.png';
import PlaybackControl from '@/views/PlaybackControl.vue';
import type { Coordinate } from 'ol/coordinate';
import {useToast} from "vue-toastification";
import { boundingExtent } from 'ol/extent';
import {fetchGeomData} from "@/services/apiService";
import {createMap, createNewVectorLayer, createNewVectorSource} from "@/services/mapService";

const toast = useToast();

let center = ref([-60.457873,0.584053]);
let projection = ref("EPSG:4326");
let zoom = ref(5);
let map = ref<Map | null>(null);
let pointFeatures = ref<Feature[]>([]);
let routeLine = ref<Feature[]>([]);
let pointFinalStar = ref<Feature[]>([]);
let lineLayer = ref<VectorLayer<VectorSource> | null>(null);
let anguloInicial = 0;

const startPointIconMap = ref<Feature<Geometry>>();
const route = ref<LineString>();
const allCoordinatesAnimation = ref<Coordinate[]>([]);
const showPlayback = ref(false);

function getInitialRotation() {
  const [lon1, lat1] = allCoordinatesAnimation.value[0];
  const [lon2, lat2] = allCoordinatesAnimation.value[1];

  const deltaLon = lon2 - lon1;
  const deltaLat = lat2 - lat1;

  anguloInicial = Math.atan2(deltaLat, deltaLon)*-1;
}

function handleFilterData(filterData:{person: number | undefined, startDate:string | null, endDate:string | null}){
  pointFeatures.value = [];
  if (map.value) {
    map.value.values_.layergroup.values_.layers.array_.forEach((layer) => {
      map.value.values_.layergroup.values_.layers.array_.pop(layer);
    })
  }
  const baseLayer = new TileLayer({
    source: new XYZ({
      url: `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=DxUujwebq5Zd8hO25SyJ`
    }),
  });
  map.value.addLayer(baseLayer);
  routeLine.value = [];
  pointFinalStar.value = [];

  fetchGeomData(filterData.person, filterData.startDate, filterData.endDate).then((points) => {
    if (!points) {
      toast.info("Nenhum ponto encontrado para o filtro selecionado.");
      if (showPlayback.value) {
        showPlayback.value = false;
      }
    } else {
      let pointList = new ref(points);
      makeGeometryPointFromArray(pointList, filterData.person);
      lineLayer.value = makeLineFromPoints(pointFeatures);
      map.value.addLayer(lineLayer.value);
      adjustMap();
    }
  });

  map.value.addLayer(createNewVectorLayer(pointFeatures));
  map.value.addLayer(createNewVectorSource(routeLine));
}

function clearPoints() {
  if (map.value) {
    map.value.values_.layergroup.values_.layers.array_.forEach((layer) => {
      map.value.values_.layergroup.values_.layers.array_.pop(layer);
    })
    pointFeatures.value = [];
    routeLine.value = [];
    pointFinalStar.value = [];

    const baseLayer = new TileLayer({
          source: new XYZ({
            url: `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=DxUujwebq5Zd8hO25SyJ`
          }),
    });
    map.value.addLayer(baseLayer);
    adjustMap();
  }
}



function createStartLayer(pointFinalStarArrayOfFeatures) {
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: pointFinalStarArrayOfFeatures.value,
    }),
    zIndex: 2,
  });
  map.value.addLayer(vectorLayer);
}
function makeGeometryPointFromArray(arrayOfGeometryObjects, nameFilter?) {
  if (arrayOfGeometryObjects.length === 0) return [];

  if (nameFilter) {
    const startPointStartPin = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[0].longitude, arrayOfGeometryObjects.value[0].latitude]),
    });

    startPointStartPin.setStyle(new Style({
      image: new Icon({
        src: IconStartPin,
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    }));

    startPointIconMap.value = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[0].longitude, arrayOfGeometryObjects.value[0].latitude]),
    });

    startPointIconMap.value.setStyle(new Style({
      image: new Icon({
        src: IconPositionMap,
        anchor: [0.5, 0.5],
        scale: 0.2,
        rotation: anguloInicial
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

    if(startPointStartPin.getGeometry()?.getCoordinates()[0] === endPoint.getGeometry()?.getCoordinates()[0]){
      if (showPlayback.value) {
        showPlayback.value = false;
      }
      toast.info("A localização do ponto de início é o mesmo do ponto de fim.");

      const startAndEnd = new Feature({
        geometry: new Point([arrayOfGeometryObjects.value[0].longitude, arrayOfGeometryObjects.value[0].latitude]),
      });

      startAndEnd.setStyle(new Style({
        image: new Icon({
          src: IconStartAndEnd,
          scale: 0.7,
          anchor: [0.5, 1],
        })
      }));
      pointFinalStar.value.push(startAndEnd);
      createStartLayer(pointFinalStar);
    } else {
      pointFinalStar.value.push(startPointStartPin);
      pointFinalStar.value.push(startPointIconMap.value);
      pointFinalStar.value.push(endPoint);
      createStartLayer(pointFinalStar);
      center.value = endPoint.getGeometry().getCoordinates();

      if (!showPlayback.value) {
        showPlayback.value = !showPlayback.value;
      } else {
        showPlayback.value = false;
        setTimeout(() => {
          showPlayback.value = true;
        }, 1);
      }
    }
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
  if (!featureList) {
    toast.info("Nenhum ponto disponível para criar linhas.");
    return null;
  }

  const groupedById = featureList.value.reduce((acc, feature) => {
    const idText = feature.get('idText');
    if (!acc[idText]) acc[idText] = [];
    acc[idText].push(feature);
    return acc;
  }, {});

  Object.keys(groupedById).forEach((idText) => {
    const points = groupedById[idText];
    allCoordinatesAnimation.value = [];

    if (points.length >= 2) {
      for (let i = 0; i < points.length - 1; i++) {
        const point1 = points[i];
        const point2 = points[i + 1];

        allCoordinatesAnimation.value.push(point1.getGeometry().getCoordinates())
        allCoordinatesAnimation.value.push(point2.getGeometry().getCoordinates())
      }

      route.value = new LineString(allCoordinatesAnimation.value)

      getInitialRotation();

      const lineFeature = new Feature({
        geometry: route.value,
      });
      lineFeature.setStyle(new Style({
        stroke: new Stroke({
          color: '#ec1c24',
          width: 6,
        }),
      }));
      routeLine.value.push(lineFeature);
    }
  })
  return new VectorLayer({
    source: new VectorSource({
      features: routeLine.value,
    })
  })
}


const adjustMap = () => {
  const coordinates = pointFeatures.value.map((pontos) =>
      pontos.getGeometry().getCoordinates()
  );
  const extent = boundingExtent(coordinates);
  if (map.value) {
    map.value
        .getView()
        .fit(extent, {padding: [50, 50, 50, 50], maxZoom: 15});
  }
};


onMounted(() => {
  map.value = createMap(center, zoom, projection);
});
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
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  z-index: 3;
}

.playback-layer {
  position: absolute;
  width: 100%;
  height: 6.8%;
  bottom: 0px;
  z-index: 2;
  transition: bottom 0.5s ease;
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