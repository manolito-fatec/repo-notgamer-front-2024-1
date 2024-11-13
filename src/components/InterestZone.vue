<template>
  <div :class="['zone-container', { 'dark-mode': storeFilters.onClickDarkMode }]">
    <div class="zone-of-interest">
      <h2 :class="['title', { 'dark-mode-text': storeFilters.onClickDarkMode }]">ZONA DE INTERESSE</h2>
      <label for="zone-name" :class="['label', { 'dark-mode-text': storeFilters.onClickDarkMode }]">
        Dê um nome para sua zona de interesse:
      </label>
      <input type="text" id="zone-name" :class="['input', { 'dark-mode-input': storeFilters.onClickDarkMode }]"
             placeholder="Nome da zona de interesse" @change="changeZoneName" v-model="zoneName"/>
      <div class="options">
        <Checkbox
            id="draw-mode"
            label="Modo desenho"
            v-model="drawMode"
            @click="$emit('toggleDrawing')"
        />
        <DropDown
            id="draw-mode-dropdown"
            :options="modeOptions"
            v-model="selectedMode"
            class="small-dropdown"
            @change="drawType"
        />
      </div>
      <div class="checkbox-and-button">
        <Checkbox
            id="hide-zones"
            label="Ocultar Desenhos"
            v-model="hideZones"
            @click="$emit('toggleZoneVisibility')"
        />
        <button :class="['save-button', { 'dark-mode-save': storeFilters.onClickDarkMode }]" @click="saveDraw">Salvar</button>
      </div>
      <DropDown id="select-hotzone" label="Selecione a zona de interesse:" :options="zoneOptions"
                v-model="selectedHotzone" class="dropdown" @change ="drawZoneChange"/>
      <button @click="removeShowedZone" :class="['remove-button', { 'dark-mode-button': storeFilters.onClickDarkMode }]">Remover filtro</button>
      <DropDown id="delete-hotzone" label="Exclua sua zona de interesse:" :options="zoneOptions"
                v-model="deletedHotzone" class="dropdown"/>
      <button @click="deleteZone" :class="['delete-button', { 'dark-mode-button': storeFilters.onClickDarkMode }]">Deletar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import DropDown from "@/components/filter/DropDown.vue";
import Checkbox from "@/components/Checkbox.vue";
import {ref, watch, onMounted} from 'vue'
import {darkModeClick} from "./stores/StoreDarkModeGetClick";
import {deleteZoneByGid, fetchAllZones} from "@/services/apiService";
import type {Coordinates, DrawedGeom} from "@/components/Types";
import {
  locationDtoToDrawedGeom,
  makePolygon,
  zoneOptions,
  drawedGeomsFromDb,
  selectedHotzone, drawingActive
} from "@/services/geomService";
import type {Polygon} from "ol/geom";
import {Map} from "ol";

let hotzoneOptions = ref([]);
const modeOptions = [
    {label:'Círculo', value:'Circle'},
    {label:'Polígono', value:'Polygon'}
]

let deletedHotzone = ref('')
let selectedMode = ref(modeOptions[0].value)
const drawMode = ref(false)
const hideZones = ref(false)
const zoneName = ref(null);
const emit = defineEmits(['saveDraw','drawType','toggleDrawing','changeZoneName','toggleZoneVisibility','drawZone','removeShowedZone','interestZonesFromDb']);
const storeFilters = darkModeClick();

watch(() => storeFilters.onClickDarkMode,
    () => {
      const filter = document.getElementById('filters')
      const title = document.getElementById('title')
      if (storeFilters.onClickDarkMode) {
        filter.style.borderRight = "4px solid #EC1C24";
        filter.style.background = "#262626";
        title.style.color = "#FFF";
      } else {
        filter.style.borderRight = "4px solid #000059",
            filter.style.background = "#EFEFEF",
            title.style.color = "#000";
      }
    });
function saveDraw() {
  emit("saveDraw");
  fetchAllZones().then((geoms) =>{
    zoneOptions.value = geoms.map(geom => ({
      label: geom.name,
      value: geom.idLocation
    })).filter((geom, index, self) =>
        index === self.findIndex(g => g.label === geom.label)
    );
    geoms.forEach(geom => {
      drawedGeomsFromDb.push(locationDtoToDrawedGeom(geom));
    })
  });
}
function changeZoneName(){

  emit('changeZoneName',zoneName.value);
}
function drawType(){
  if(drawingActive.value){
    drawMode.value = !drawMode.value
    emit('toggleDrawing');
    emit('drawType',selectedMode.value);
    emit('toggleDrawing');
    drawMode.value = !drawMode.value
  }else{
    emit('drawType',selectedMode.value);
    emit('toggleDrawing');
    drawMode.value = !drawMode.value
  }
}
function drawZoneChange(){
  let drawZonePolygon :Polygon = {};
  let selectedId :number = Number(selectedHotzone.value);
  drawedGeomsFromDb.forEach((geom) =>{
    if(geom.gid == selectedId){
      drawZonePolygon = makePolygon(geom);
    }
  })
  emit('drawZone',drawZonePolygon);
}
function removeShowedZone(){
  selectedHotzone.value = 0;
  emit('removeShowedZone')
}
function deleteZone(){
  emit('removeShowedZone');
  let selectedId :number = Number(deletedHotzone.value);
  deleteZoneByGid(selectedId).then((geoms) =>{
    fetchAllZones().then((geoms) =>{
      zoneOptions.value = geoms.map(geom => ({
        label: geom.name,
        value: geom.idLocation
      })).filter((geom, index, self) =>
          index === self.findIndex(g => g.label === geom.label)
      );
      geoms.forEach(geom => {
        drawedGeomsFromDb.push(locationDtoToDrawedGeom(geom));
      })
      deletedHotzone = ref<number>();
    });
  });
}
onMounted(()=>{
  fetchAllZones().then((geoms) =>{
    zoneOptions.value = geoms.map(geom => ({
      label: geom.name,
      value: geom.idLocation
    })).filter((geom, index, self) =>
        index === self.findIndex(g => g.label === geom.label)
    );
    geoms.forEach(geom => {
      drawedGeomsFromDb.push(locationDtoToDrawedGeom(geom));
    })
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.zone-container {
  position: fixed;
  top: 3%;
  left: 100px;
  width: 380px;
  height: 87%;
  padding: 8px;
  background: #EFEFEF;
  border-right: 4px solid #000059;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: right 0.5s ease;
  color: #000;
  z-index: 10;
  font-family: 'Poppins', regular, sans-serif;
}

.zone-of-interest {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border-radius: 8px;
}

.title {
  font-family: 'Poppins', regular, sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #000;
  padding-bottom: 8px
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-family: 'Poppins', regular, sans-serif;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #6D6D6D;
  color: #FFF;
  margin-bottom: 20px;
}

.input::placeholder {
  color: #FFFFFF;
  opacity: 1;
}

.options {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.small-dropdown {
  width: 120px;
  margin-left: auto;
}

.checkbox-and-button {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.save-button {
  padding: 10px 34.8px;
  background-color: #000059;
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;
}

.remove-button, .delete-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #000059;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}

.dropdown {
  margin-bottom: 16px;
  width: 100%;
}

.dark-mode {
  background-color: #262626 !important;
  border-right: 4px solid #EC1C24;
}

.dark-mode-text {
  color: #FFF !important;
}

.dark-mode-input {
  background-color: #444444 !important;
  color: #FFF
}

.dark-mode-button {
  background-color: #EC1C24 !important;
}

.dark-mode-input::placeholder {
  color: #FFF !important;
  opacity: 0.8;
}

.save-button.dark-mode-save {
  background-color: #EC1C24 !important;
}
</style>