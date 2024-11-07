<template>
  <div class="zone-container">
    <div class="zone-of-interest">
      <h2 class="title">ZONA DE INTERESSE</h2>

      <label for="zone-name" class="label">Dê um nome para sua zona de interesse:</label>
      <input class="input" placeholder="Nome da zona de interesse" v-model="zoneName" @change="changeZoneName"/>

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
            label="Ocultar Zonas"
            v-model="hideZones"
            @click="$emit('toggleZoneVisibility')"
        />
        <button class="save-button" @click="saveDraw">Salvar</button>
      </div>

      <DropDown
          id="select-hotzone"
          label="Selecione a zona de interesse:"
          :options="hotzoneOptions"
          v-model="selectedHotzone"
          @change ="drawZone"
          class="dropdown"
      />

      <button class="remove-button">Remover filtro</button>

      <DropDown
          id="delete-hotzone"
          label="Exclua sua zona de interesse:"
          :options="hotzoneOptions"
          v-model="deletedHotzone"
          class="dropdown"
      />

      <button class="delete-button">Deletar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import DropDown from "@/components/filter/DropDown.vue";
import Checkbox from "@/components/Checkbox.vue";
import {onMounted, ref} from 'vue'
import {fetchAllZones} from "@/services/apiService";
import type {Coordinates, DrawedGeom} from "@/components/Types";
import {makePolygon} from "@/services/geomService";
import type {Polygon} from "ol/geom";

let hotzoneOptions = ref([]);
const modeOptions = [
    {label:'Círculo', value:'Circle'},
    {label:'Polígono', value:'Polygon'}
]
const selectedHotzone = ref<number>()
const deletedHotzone = ref('')
let selectedMode = ref(modeOptions[0].value)
const drawMode = ref(false)
const hideZones = ref(false)
const zoneName = ref(null);
let drawedGeomsFromDb :DrawedGeom[] =[];
const emit = defineEmits(['saveDraw','drawType','toggleDrawing','changeZoneName','toggleZoneVisibility','drawZone']);

function saveDraw() {
  emit('saveDraw');
}

function changeZoneName(){
  emit('changeZoneName',zoneName.value);
}

function drawType(){
  if(drawMode.value){
    emit('toggleDrawing');
    emit('drawType',selectedMode.value);
    emit('toggleDrawing');
  }else{
    emit('drawType',selectedMode.value);
    emit('toggleDrawing');
    drawMode.value = true;
  }
}
function locationDtoToDrawedGeom(data):DrawedGeom|null{
  let newDrawedGeom :DrawedGeom = {};
  let newCoordinates :Coordinates = {};
  let newCoordinatesArray :Coordinates[] = [];
  if (data.shape =='CIRCLE'){
    newDrawedGeom.gid = data.idLocation;
    newDrawedGeom.name = data.name;
    newDrawedGeom.shape = data.shape;
    newCoordinatesArray[0] = {latitude: 0, longitude:0}
    newDrawedGeom.coordinates = newCoordinatesArray;
    newCoordinates = {longitude :data.center[0], latitude :data.center[1]}
    newDrawedGeom.center = newCoordinates;
    newDrawedGeom.radius = data.radius;
    return newDrawedGeom;
  } else {
    newDrawedGeom.gid = data.idLocation;
    newDrawedGeom.name = data.name;
    newDrawedGeom.shape = data.shape;
    newCoordinates = data.coordinates
    newDrawedGeom.coordinates = newCoordinates;
    return newDrawedGeom;
  }
}
function drawZone(){
  let selectedGeom :Polygon = {};
  let selectedId :number = Number(selectedHotzone.value);
  console.log(drawedGeomsFromDb);
  drawedGeomsFromDb.forEach((geom) =>{
    if(geom.gid == selectedId){
      selectedGeom = makePolygon(geom);
    }
  })
  emit('drawZone',selectedGeom);

}
onMounted(()=>{
  fetchAllZones().then((geoms) =>{
    hotzoneOptions.value = geoms.map(geom => ({
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
  top: 0;
  left: 100px;
  width: 420px;
  height: 100%;
  padding: 8px;
  background: linear-gradient(180deg, #262626 0%, #3A3A3A 50%, #262626 100%);
  border-left: 4px solid #EC1C24;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: right 0.5s ease;
  color: #ffffff;
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #444444;
  color: #ffffff;
  margin-bottom: 20px;
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
  padding: 10px 38px;
  background-color: #EC1C24;
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;
}

.dropdown {
  margin-bottom: 16px;
  width: 100%;
}

.remove-button, .delete-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #EC1C24;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>