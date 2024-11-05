<template>
  <div class="history-title" id="history-title">Histórico:</div>
  <div class="history-wrapper" id="history-wrapper">
    <div class="history-container" id="history-container">
      <contenthistory id ="content-history">
        <div class="start-icon"></div>
        <div class="grid">
          <div class="text-detail" id="text-detail">
            {{ formatDateTime(props.historyConfiguration[0]?.initDateTime) }}
          </div>
          <div class="text-detail" id="text-detail-content">
            {{ props.historyConfiguration[0]?.initial?.address?.road }} -
            {{ props.historyConfiguration[0]?.initial?.address?.town }} -
            {{ props.historyConfiguration[0]?.initial?.address?.state }} -
            {{ props.historyConfiguration[0]?.initial?.address?.country }}
          </div>
        </div>
      </contenthistory>
      <button class="expand-history" @click="expandItems" id="expand-history">Linha do tempo
        <div class="icon-expand"></div>
      </button>
    </div>
    <Loading  v-if="props.loading"/>
    <ul class="history-container">
      <HistoryDetail v-for="config in props.historyConfiguration"
                     v-if="!props.loading && showHistory " :key="props.historyConfiguration.length"
                     :HistoryDetail="config">
      </HistoryDetail>
      <span style="display: flex; justify-content: center;" v-if="props.historyConfiguration.length == 0 && !props.loading && showHistory">
        <p>Histórico Vazio</p>
      </span>
    </ul>
    <div class="history-container">
      <contenthistory id ="end-content-history">
        <div class="end-icon"></div>
        <div class="grid">
          <div class="text-detail" id="end-text-detail">
            {{ formatDateTime(props.historyConfiguration[historyConfiguration.length - 1]?.initDateTime) }}
          </div>
          <div class="text-detail" id="end-text-detail-content">
            {{ props.historyConfiguration[historyConfiguration.length - 1]?.finality?.address?.road }} -
            {{ props.historyConfiguration[historyConfiguration.length - 1]?.finality?.address?.town }} -
            {{ props.historyConfiguration[historyConfiguration.length - 1]?.finality?.address?.state }} -
            {{ props.historyConfiguration[historyConfiguration.length - 1]?.finality?.address?.country }}
          </div>
        </div>
      </contenthistory>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import HistoryDetail from './HistoryDetail.vue';
import type {HistoryConfig} from './Types'
import Loading from '@/components/Loading.vue'
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'
import { getClick } from '@/components/stores/StoreGetClick.js'

const store = darkModeClick();
const storeFilters = getClick();

const showHistory = ref(false)
const props = defineProps<{
  historyConfiguration: HistoryConfig
  loading: Boolean
}>();

watch(() => props.historyConfiguration,() => {
  showHistory.value = true;
});

function expandItems() {
  showHistory.value = !showHistory.value
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

watch(() => store.onClickDarkMode && storeFilters.onClickFilters,
  () => {
  const historyWrapper = document.getElementById('history-wrapper')
  const historyTittle = document.getElementById('history-title')
  const historyContainer = document.getElementById('history-container')
  const historyContent = document.getElementById('content-history')
  const endHistoryContent = document.getElementById('end-content-history')
  const textDetail = document.getElementById('text-detail')
  const textDetailContent = document.getElementById('text-detail-content')
  const endTextDetail = document.getElementById('end-text-detail')
  const endTextDetailContent = document.getElementById('end-text-detail-content')
  const expandHistory = document.getElementById('expand-history')
  const expandedHistory = document.getElementById('expanded-history')
  
  if (store.onClickDarkMode && storeFilters.onClickFilters) {
    historyWrapper.style.background = "#3D3D3D";
    historyTittle.style.color = "#FFF"
    historyContainer.style.background = "#3D3D3D"
    historyContainer.style.borderColor = "#3D3D3D"
    historyContent.style.borderColor = "#3D3D3D"
    endHistoryContent.style.borderColor = "#3D3D3D"
    historyContent.style.background = "#6D6D6D"
    endHistoryContent.style.background = "#6D6D6D"
    textDetail.style.color = "#FFF"
    textDetailContent.style.color = "#FFF"
    endTextDetail.style.color = "#FFF"
    endTextDetailContent.style.color = "#FFF"
    expandHistory.style.color = "#FFF"
    expandHistory.style.borderColor = "#3D3D3D"
    expandHistory.style.background = "#4A4A4A"

  } else {
    historyWrapper.style.background = "#A0A0A0";
    historyTittle.style.color = "#000"
    historyContainer.style.background = "#A0A0A0"
    historyContainer.style.borderColor = "#A0A0A0"
    historyContent.style.borderColor = "#A0A0A0"
    endHistoryContent.style.borderColor = "#A0A0A0"
    historyContent.style.background = "#808080"
    endHistoryContent.style.background = "#808080"
    textDetail.style.color = "#000"
    textDetailContent.style.color = "#000"
    endTextDetail.style.color = "#000"
    endTextDetailContent.style.color = "#000"
    expandHistory.style.color = "#000"
    expandHistory.style.borderColor = "#A0A0A0"
    expandHistory.style.background = "#DADADA"
    
  }
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.history-wrapper {
  background-color: #C2C2C2;
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
  color: #000;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 5px;
  margin-top: 5px;
}

.history-container {
  overflow: auto;
  max-height: 260px;
  padding: 0;
  border-radius: 6px;
  margin-bottom: 0px;
  display: grid;
  grid-template-rows: auto;
  row-gap: 1px;
}

.text-detail {
  align-content: center;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  color: #000;
  font-size: 12px;
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
  border-color: #C2C2C2;
  border-style: solid;
  border-radius: 8px;
  background-color: #808080;
  padding: 0%;
  resize: none;
  box-sizing: border-box;
  cursor: default;
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
  justify-items: center;
  align-items: center;
}

.expand-history {
  display:block;
  width: 100%;
  height: 100%;
  background-color: #DADADA;
  color: #000;
  font-size: 11px;
  padding: 2%;
  border-radius: 10px;
  border-style: solid;
  border-color: #C2C2C2;
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
  justify-items: center;
  align-items: center;
}

</style>
