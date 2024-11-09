<template>
  <div class="map-wrapper">
    <GeoFilterView class="filter-overlay"
                   @saveFilter="handleFilterData"
                   @clearPoints="clearPoints"
                   @saveDraw="saveGeometry"
                   @toggleDrawing="toggleDrawing"
                   @drawType="drawTypeUpdate"
                   @changeZoneName="changeZoneName"
                   @toggleZoneVisibility="toggleZoneVisibility"
                   @drawZone="drawZone"
                   @removeZoneFilters="removeZoneFilters"
    />

    <div v-if="showPlayback" class="playback-layer">
      <PlaybackControl
        v-model:rota="route" 
        v-model:iconMap="startPointIconMap"
        v-model:allCoordinatesAnimation="allCoordinatesAnimation"
        v-model:anguloInicial="anguloInicial"
      />
    </div>
    <DarkOrLight class="toggle-dark-white-mode" @toggle-dark-white-mode="toggleTheme"/> 
    <div id="map" class="map-container"></div>
    <div
        class="icon-center"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
        @click="centerMap"
        :style="{ cursor: 'pointer', opacity: iconOpacity }"
    >
      <i class="fa-solid fa-location-crosshairs icon-center-icon"></i>
    </div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Map, Feature, Overlay} from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import {XYZ} from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import {Point, LineString, Geometry, Circle, type Polygon} from 'ol/geom';
import {Style, Stroke, Fill, Icon} from 'ol/style';
import GeoFilterView from "@/views/GeoFilterView.vue";
import PlaybackControl from '@/views/PlaybackControl.vue';
import type { Coordinate } from 'ol/coordinate';
import {useToast} from "vue-toastification";
import { boundingExtent } from 'ol/extent';
import {fetchGeomData, fetchGeomDataWithinZone, fetchPersonById, fetchStopPoints} from "@/services/apiService";
import {createMap, createNewVectorLayer} from "@/services/mapService";
import {Draw} from "ol/interaction";
import DarkOrLight from '@/views/DarkOrLight.vue';
import IconStopPoint from "@/assets/IconStopPoint.png";
import type {DrawedGeom, GeometryPoint, Pessoa, StopPoint} from "@/components/Types";
import {
  createStartAndEndPoint,
  makeFeature, makeLineString, makeMultiplePointsLegacy,
  makePointsFromArray,
  makePolygon,
  makeSinglePoint,
  saveGeoms
} from "@/services/geomService";


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
let drawGeomName = ref<string>();
let zoneVisibility = ref(true);

const mapMode = ref(false);
let darkOrWhiteMap: string;
const iconScale = ref(1);
const iconOpacity = ref(1);

function saveGeometry(){
  map.value?.getLayers().array_.forEach(layer =>{
    if(layer.values_.layerName == 'Draw Layer'){
      layer.getSource().getFeatures().forEach(feature =>{
        saveGeoms(feature,drawGeomName.value);
      });
      map.value?.removeLayer(layer);
    }
  })
}
function toggleZoneVisibility(){
  if(zoneVisibility.value) {
    zoneVisibility.value = false;
    map.value?.getLayers().array_.forEach(layer =>{
      if(layer.values_.layerName == 'Draw Layer'){
        console.log(layer.setVisible(false))
      }
    })
  } else {
    zoneVisibility.value = true;
    map.value?.getLayers().array_.forEach(layer =>{
      if(layer.values_.layerName == 'Draw Layer'){
        console.log(layer.setVisible(true))
      }
    })
  }
}

function drawTypeUpdate(selectedMode:selectedMode){
  drawType.value = selectedMode;
}
function changeZoneName(newZoneName){
  drawGeomName.value = newZoneName;
}

function toggleTheme() {
  const iconCenter = document.getElementById("icon-center");
  mapMode.value = !mapMode.value;

  if (mapMode.value) {
    darkOrWhiteMap = 'streets-v2-dark';
  } else {
    darkOrWhiteMap = 'streets-v2';
  }
  if (map.value) {
    map.value?.getLayers().array_.forEach(layer => {
      if(layer.values_.layerName == 'TileLayer'){
        layer.setSource(new XYZ({
          url: `https://api.maptiler.com/maps/${darkOrWhiteMap}/{z}/{x}/{y}.png?key=DxUujwebq5Zd8hO25SyJ`
        }));
      }
    })
  }
}
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
  const [lon1, lat1] = allCoordinatesAnimation.value;
  const [lon2, lat2] = allCoordinatesAnimation.value;

  const deltaLon = lon2 - lon1;
  const deltaLat = lat2 - lat1;

  anguloInicial = Math.atan2(deltaLat, deltaLon)*-1;
}

function convertToGeometryPoints(data: any[]): GeometryPoint[] | null {
  let geometryPoints:GeometryPoint[]= [];
  data.forEach(d => {
    let newGeometryPoint: GeometryPoint = {};
    newGeometryPoint.id = d.id;
    newGeometryPoint.idText = d.itoId;
    newGeometryPoint.createdAt = d.createdAt;
    newGeometryPoint.coordinates = [d.longitude, d.latitude];
    geometryPoints.push(newGeometryPoint);
  })
  return geometryPoints;
}
function handleFilterData(filterData:{person: number | undefined, startDate:string | null, endDate:string | null, selectedZone:number | null}){
  if(filterData.selectedZone){
    plotStopPoints(filterData.person, filterData.startDate, filterData.endDate, filterData.selectedZone)
    fetchGeomDataWithinZone(filterData.startDate, filterData.endDate, filterData.selectedZone).then((points:GeometryPoint[]) => {
    if (!points) {
      toast.info("Nenhum ponto encontrado para o filtro selecionado.");
      if (showPlayback.value) {
        showPlayback.value = false;
      }
    }
    let filteredPoints:GeometryPoint[] = [];
    points.forEach((point) => {
      if(point.person.idPerson == filterData.person){
        point.person = fetchPersonById(filterData.person);
        filteredPoints.push(point);
      }
    })
      map.value.addLayer(createNewVectorLayer(source,'Draw Layer',source));
      const geometryPoints = convertToGeometryPoints(points);
      map.value?.addLayer(createNewVectorLayer(createStartAndEndPoint(geometryPoints,anguloInicial),undefined,undefined,4),'Layer dos Pontos');
      let pointFeaturesNew :Feature[] =[];
      geometryPoints.forEach(point =>{
        pointFeaturesNew.push(makeFeature(makeSinglePoint(point)));
      })
      pointFeatures.value = makeMultiplePointsLegacy(points);
      map.value.addLayer(makeLineFromPoints(pointFeatures));
      map.value?.on('singleclick', handleMapClick);
      showPlayback.value = true;
      initializePopup();
      adjustMap();

    })
  } else {
    plotStopPoints(filterData.person, filterData.startDate, filterData.endDate);
    fetchGeomData(filterData.person, filterData.startDate, filterData.endDate, 0).then((points) => {
      if (!points) {
        toast.info("Nenhum ponto encontrado para o filtro selecionado.");
        if (showPlayback.value) {
          showPlayback.value = false;
        }
      } else {
        map.value.addLayer(createNewVectorLayer(source,'Draw Layer',source));
        const geometryPoints = convertToGeometryPoints(points);
        map.value?.addLayer(createNewVectorLayer(createStartAndEndPoint(geometryPoints,anguloInicial),undefined,undefined,4),'Layer dos Pontos');
        let pointFeaturesNew :Feature[] =[];
        geometryPoints.forEach(point =>{
          pointFeaturesNew.push(makeFeature(makeSinglePoint(point)));
        })
        pointFeatures.value = makeMultiplePointsLegacy(points);
        map.value.addLayer(makeLineFromPoints(pointFeatures));
        map.value?.on('singleclick', handleMapClick);
        showPlayback.value = true;
        initializePopup();
        adjustMap();
      }
    });
  }



}
function plotStopPoints(person: number , startDate:string, endDate:string, selectedZone?:number) {
  fetchStopPoints(person, startDate, endDate, 0).then((points:StopPoint[]) => {
    if (!points) {
      toast.info("Nenhum ponto encontrado para o filtro selecionado.");
      if (showPlayback.value) {
        showPlayback.value = false;
      }
    } else {
      let stopPointStyle:Style = new Style({
        image: new Icon({
          src: IconStopPoint,
          scale: 0.6,
          anchor: [0.5, 1],
        }),
      });
      map.value?.addLayer(createNewVectorLayer(makePointsFromArray(points,stopPointStyle)));
    }
  });
}

function clearPoints() {
  if (map.value) {
    map.value?.getLayers().array_.forEach(layer => {
      while (map.value?.getLayers().array_[map.value?.getLayers().array_.length-1].values_.layerName != 'TileLayer'){
        map.value?.removeLayer(map.value?.getLayers().array_[map.value?.getLayers().array_.length-1]);
      }
    })
    route.value = [];
    pointFeatures.value = [];
    routeLine.value = [];
    pointFinalStar.value = [];
    if (popupContent.value) {
      popupContent.value.innerHTML = null;
      popup.value?.setPosition(null);
    }
    map.value.addLayer(createNewVectorLayer(source,'Draw Layer',source));
    adjustMap();
    showPlayback.value = false;
  }
}
function makeLineFromPoints(featureList:Feature[]) {
  if (!featureList) {
    toast.info("Nenhum ponto disponível para criar linhas.");
    return null;
  }
  let featureArray :Feature[] = [];
  let newLineString: LineString = makeLineString(featureList);
  featureArray.push(new Feature({geometry: newLineString}));
  featureArray[0].setStyle(new Style({
    stroke: new Stroke({
      color: '#000000',
      width: 4
    }),
    zIndex: 4
  }));
  route.value = newLineString;
  map.value?.getLayers().array_.forEach(layer =>{
    if(layer.values_.layerName == undefined){
      startPointIconMap.value = layer.getSource().getFeatures()[2];
    }
  });
  allCoordinatesAnimation.value = makeLineString(featureList).getCoordinates();

  let lineLayer :VectorLayer = createNewVectorLayer(featureArray,'Layer das Rotas');
  return lineLayer
}


const adjustMap = (drawedZone?:Polygon|Circle) => {
  if(drawedZone){
    const extent = drawedZone.getExtent();
    if (map.value) {
      map.value
          .getView()
          .fit(extent, {padding: [50, 50, 50, 50], maxZoom: 15,duration: 1000});
    }
  } else {
    const coordinates = pointFeatures.value.map((pontos) =>
        pontos.getGeometry().getCoordinates()
    );
    const extent = boundingExtent(coordinates);
    map.value?.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 15 ,duration: 1000});
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
function centerMap() {
  if (map.value) {
    if (pointFeatures.value.length === 0) {
      const defaultCenter = [-60.457873, 0.584053];
      const defaultZoom = 5;

      map.value?.getView().setCenter(defaultCenter);
      map.value?.getView().setZoom(defaultZoom);
    } else {
      let coordinates;
      map.value?.getLayers().array_.forEach(layer =>{
        if(layer.values_.layerName == 'Layer dos Pontos'){
          layer.getSource().getFeatures().forEach(feature =>{
            console.log(feature.getGeometry()[1]);
          });
        }
      });
      const extent = boundingExtent(coordinates);


      map.value?.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 15 ,duration: 1000});
    }
  }
}
function drawZone(drawZonePolygon:drawZone){
  let featureArray :Feature[] = [];
  let newFeature :Feature = makeFeature(undefined,undefined,drawZonePolygon);
  featureArray.push(newFeature);
  let newVectorLayer:VectorLayer = createNewVectorLayer(featureArray,'Layer das Zonas');
  map.value?.getLayers().array_.forEach((layer) =>{
    if(layer.values_.layerName == 'Layer das Zonas')
    map.value?.removeLayer(layer);
  });
  map.value?.addLayer(newVectorLayer);
  adjustMap(drawZonePolygon);
}
function removeZoneFilters(){
  map.value?.getLayers().array_.forEach((layer) =>{
    if(layer.values_.layerName == 'Layer das Zonas')
      map.value?.removeLayer(layer);
  });
}
onMounted(() => {
  darkOrWhiteMap = 'streets-v2';
  map.value = createMap(center, zoom, projection, darkOrWhiteMap);
  map.value.addLayer(createNewVectorLayer(source, 'Draw Layer',source));
  initializePopup()
});
</script>

<style scoped>
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

.map-container {
  width: 100vw;
  height: 100vh;
}

.filter-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  padding: 10px;
  border-radius: 8px;
  z-index: 3;
}

.playback-layer {
  width: 100%;
  height: 6.8%;
  position: absolute;
  bottom: 0px;
  z-index: 2;
  transition: bottom 0.5s ease;
  align-content: center;
  align-items: center;
}

.toggle-dark-white-mode {
  justify-content: center;
  position: absolute;
  right: 11px;
  bottom: 138px;
  z-index: 2;
}

:global(.ol-zoom-in) {
  bottom: 3.5em;
  right: 10px;
  position: fixed;
}

:global(.ol-zoom-out) {
  bottom: 1em;
  right: 10px;
  position: fixed;
}

:global(.ol-control button)  {
  color: #000000;
  display: block;
  font-weight: bold;
  font-size: inherit;
  text-align: center;
  height: 2.67em;
  width: 2.67em;
  line-height: .4em;
  border: none;
  border-radius: 2px;
}

.icon-center {
  position: absolute;
  bottom: 97.91px;
  right: 11px;
  z-index: 4;
  background-color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}

.icon-center-icon {
  font-size: 20px;
  color: #3A3A3A;
}

</style>