<template>
  <div class="history-title">Histórico:</div>
  <div class="history-wrapper">
    <div class="history-container">
    <contenthistory>
      <div class="start-icon"></div>
      <div class="grid">
      <div class="text-detail">
        {{formatDateTime(props.historyConfiguration[0]?.initDateTime)}}
        </div>
        <div class="text-detail">
        {{props.historyConfiguration[0]?.initial?.address?.road}} - 
        {{props.historyConfiguration[0]?.initial?.address?.town}} - 
        {{props.historyConfiguration[0]?.initial?.address?.state}} - 
        {{props.historyConfiguration[0]?.initial?.address?.country}}
      </div>
    </div>
    </contenthistory>
    <button class="expand-history" @click="expandItems">Linha do tempo
      <div class = "icon-expand"></div>
    </button>
  </div>
      <ul class="history-container">
        <HistoryDetail v-if="showHistory" 
          v-for="config in props.historyConfiguration" :key="props.historyConfiguration.length"
          :HistoryDetail="config" >
        </HistoryDetail>
      </ul>
      <div class="history-container">
      <contenthistory>
        <div class="end-icon"></div>
        <div class="grid">
        <div class="text-detail">
        {{formatDateTime(props.historyConfiguration[historyConfiguration.length -1]?.initDateTime)}}
        </div>
        <div class="text-detail">
        {{props.historyConfiguration[historyConfiguration.length -1]?.initial?.address?.road}} - 
        {{props.historyConfiguration[historyConfiguration.length -1]?.initial?.address?.town}} - 
        {{props.historyConfiguration[historyConfiguration.length -1]?.initial?.address?.state}} - 
        {{props.historyConfiguration[historyConfiguration.length -1]?.initial?.address?.country}}
      </div>
    </div>
      </contenthistory>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import iconIn from './icons/iconIn.vue';
import iconOut from './icons/iconOut.vue';
import iconExpand from './icons/iconExpand.vue';
import HistoryDetail from './HistoryDetail.vue';
import type {HistoryConfig} from './Types'
import type {HistoryContent} from './Types'
import type {Points} from './Types'
import type {Address} from './Types'

const showHistory = ref (false)
const historyText = ref('')
const props = defineProps<{
  historyConfiguration: HistoryConfig
}>();

function expandItems(){
  showHistory.value= !showHistory.value
}

function formatDateTime(dateString: string): string {
  if (!dateString) return 'Data e horário indisponíveis';
  
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.history-wrapper {
  background-color: #3D3D3D;
  border-radius: 5px;
}

.start-icon {
  width: 30px;
  height: 30px;
  background-image: url('@/assets/IconStartPin.png');
  background-size: 75%;
  background-repeat: no-repeat;
  background-position: center;
}

.end-icon {
  width: 30px;
  height: 30px;
  background-image: url('@/assets/IconEndPin.png');
  background-size: 75%;
  background-repeat: no-repeat;
  background-position: center;
}

.history-title {
  color: #ffffff;
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 11px;
  font-family: 'Poppins', regular, sans-serif;
}

.history-container {
  overflow:auto;
  max-height: 160px;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #3D3D3D;
  display: flexbox;
  grid-template-rows: repeat(auto, 100%);
  padding: 0%;
  align-items: center;
  justify-items: center;
  row-gap: 2%;
}

.text-detail {
  align-content: center;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  color: #ffffff;
  font-size: 10px;
  font-family: 'Poppins', regular, sans-serif;
  resize: none;
  box-sizing: border-box;
  cursor: default;
}

.history-container contenthistory {
  display: grid;
  grid-template-columns: 10% 90%;
  width: 100%;
  height: 100%;
  border-color: #3D3D3D;
  border-style: solid;
  border-radius: 10px;
  background-color: #686D76;
  padding: 2%;
  resize: none;
  box-sizing: border-box;
  cursor:default;
  justify-items: center;
  align-items: center;
}

.expanded-history {
  display: grid;
  grid-template-columns: 10% 80% 10%;
  width: 100%;
  height: 100%;
  background-color: #4a4a4a;
  padding: 1%;
  resize: none;
  border-radius: 10px;
  border-style: solid;
  border-color: #3D3D3D;
  box-sizing: border-box;
  cursor: default;
  justify-items:center;
  align-items: center;
}

.expand-history {
  display: grid;
  grid-template-columns: 95% 5%;
  width: 100%;
  height: 100%;
  background-color: #4a4a4a;
  color: white;
  font-size: 10px;
  padding: 2%;
  border-radius: 10px;
  border-style: solid;
  border-color: #3D3D3D;
  cursor: pointer;
  justify-items: start;
  align-items: center;
}
.grid {
    display: grid;
    grid-template-rows: 30% 70%;
    padding: 5px;
    width: 100%;
    height: auto;
    cursor: default;
    justify-items:center;
    align-items: center;
  }
</style>
