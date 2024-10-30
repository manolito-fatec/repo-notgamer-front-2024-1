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
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    <div class="controls">
      <select v-model="drawType">
        <option value="Circle">Desenhar Círculo</option>
        <option value="Polygon">Desenhar Polígono</option>
      </select>
      <button class="draw-button" @click="toggleDrawing">
        {{ drawingActive ? 'Desativar Desenho' : 'Ativar Desenho' }}
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Map, Feature, Overlay} from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import {OSM, XYZ} from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point, LineString, Geometry } from 'ol/geom';
import {Icon, Style, Stroke, Fill} from 'ol/style';
import IconStartPin from '../assets/IconStartPin.png';
import IconStartAndEnd from '../assets/IconStartAndEnd.png';
import IconEndPin from '../assets/IconEndPin.png';
import GeoFilterView from "@/views/GeoFilterView.vue";
import IconPositionMap from '../assets/IconPositionMap.png';
import PlaybackControl from '@/views/PlaybackControl.vue';
import type { Coordinate } from 'ol/coordinate';
import {useToast} from "vue-toastification";
import { boundingExtent } from 'ol/extent';
import {fetchGeomData, fetchPersonById} from "@/services/apiService";
import {createMap, createNewVectorLayer} from "@/services/mapService";
import {Draw} from "ol/interaction";

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

let popup = ref<Overlay | null>(null);
let popupContent = ref<HTMLElement | null>(null);
let popupCloser = ref<HTMLElement | null>(null);

const source = new VectorSource();
const drawLayer = new VectorLayer({ source });
let draw = ref<Draw | null>(null);
let drawingActive = ref(false);
let drawType = ref('Circle');

function initializePopup() {
  popupContent.value = document.getElementById('popup-content');
  popupCloser.value = document.getElementById('popup-closer');

  popup.value = new Overlay({
    element: document.getElementById('popup')!,
    autoPan: true,
    autoPanAnimation: { duration: 250 },
  });

  popupCloser.value.onclick = function () {
    popup.value?.setPosition(undefined);
    popupCloser.value?.blur();
    return false;
  };

  map.value?.addOverlay(popup.value);
}

function handleMapClick(event) {
  if (popupContent.value) {
    popupContent.value.innerHTML = null;
    popup.value?.setPosition(null);
  }
  map.value?.forEachFeatureAtPixel(event.pixel, function (feature) {

    let coordinates = (feature.getGeometry() as Point).getCoordinates();
    let name = feature.values_.person.fullName
    if (popupContent.value) {
      popupContent.value.innerHTML = `<p><b>${name}</b></p><p>Coordenadas: ${coordinates}</p>`;
      popup.value?.setPosition(coordinates);
    }
  });
}


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
    map.value?.getLayers().array_.forEach(layer => {})
  }
  routeLine.value = [];
  pointFinalStar.value = [];

  fetchGeomData(filterData.person, filterData.startDate, filterData.endDate, 0).then((points) => {
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
  map.value.addLayer(createNewVectorLayer(routeLine, 'Layer das Rotas'));
  map.value.addLayer(createNewVectorLayer(source,'Draw Layer',source));
  initializePopup();
  map.value?.on('singleclick', handleMapClick);
  console.log(map.value?.getLayers().array_);
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
          source: new OSM(),
    });
    map.value.addLayer(baseLayer);
    if (popupContent.value) {
      popupContent.value.innerHTML = null;
      popup.value?.setPosition(null);
    }
    map.value.addLayer(createNewVectorLayer(source,'Draw Layer',source));
    adjustMap();
  }
}
function makeGeometryPointFromArray(arrayOfGeometryObjects, nameFilter?) {
  if (arrayOfGeometryObjects.length === 0) return [];

  if (nameFilter) {
    const startPointStartPin = new Feature({
      geometry: new Point([arrayOfGeometryObjects.value[0].longitude, arrayOfGeometryObjects.value[0].latitude]),
    });
    const personInPoint = ref();
    fetchPersonById(nameFilter).then( person => {
      personInPoint.value = person;
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
      startPointStartPin.setProperties({person: personInPoint});
      endPoint.setProperties({person: personInPoint});
      startAndEnd.setProperties({person: personInPoint});
      pointFinalStar.value.push(startAndEnd);
      map.value.addLayer(createNewVectorLayer(pointFinalStar, 'Layer dos pontos finais e iniciais'));
    } else {
      startPointStartPin.setProperties({person: personInPoint});
      endPoint.setProperties({person: personInPoint});
      pointFinalStar.value.push(startPointStartPin);
      pointFinalStar.value.push(startPointIconMap.value);
      pointFinalStar.value.push(endPoint);
      map.value.addLayer(createNewVectorLayer(pointFinalStar, 'Layer dos pontos finais e iniciais'));
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
function toggleDrawing() {
  if (drawingActive.value) {
    if(pointFinalStar.value){
      map.value?.on('singleclick', handleMapClick);
    }
    stopDrawing();
  } else {
    map.value.removeEventListener('singleclick', handleMapClick);
    startDrawing();
  }
}
function startDrawing() {
  if (!map.value) return;
    drawingActive.value = true;
    draw.value = new Draw({
    source: source,
    stopClick: true,
    type: drawType.value as 'Circle' | 'Polygon',
    style: new Style({
    fill: new Fill({ color: 'rgba(110,105,105,0.52)' }),
    stroke: new Stroke({ color: '#ec3b3b', width: 4 }),
    }),
  });
  draw.value.on('drawend', (event) => {
    useToast().info('Desenho finalizado!');
  });
  map.value.addInteraction(draw.value);
  map.value.getViewport().addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (draw.value) {
      draw.value.abortDrawing();
      toggleDrawing();
    }
  });
}
function stopDrawing() {
  if (draw.value && map.value) {
    map.value.removeInteraction(draw.value);
    draw.value = null;
    drawingActive.value = false;
  }
}

onMounted(() => {
  map.value = createMap(center, zoom, projection);
  map.value.addLayer(createNewVectorLayer(source, 'Draw Layer',source));
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
.ol-popup {
  position: absolute;
  background-color: black;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #c1060a;
  min-width: 200px;
  z-index: 10;
  bottom: 12px;
  left: 50px;
  transform: translate(-50%, -100%);
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  font-size: 1.2em;
}
.controls {
  position: absolute;
  top: 200px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 4;
}

.draw-button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.draw-button:hover {
  background-color: #45a049;
}


</style>