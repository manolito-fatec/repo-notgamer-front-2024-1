<template>
  <div class="history-wrapper" :class="{ 'dark-mode': isDarkMode }">
    <div class="history-title">Histórico:</div>
    <div class="history-container">
      <contenthistory class="history-entry">
        <div class="start-icon"></div>
        <div class="grid">
          <div class="text-detail">
            {{ formatDateTime(props.historyConfiguration[0]?.initDateTime) }}
          </div>
          <div class="text-detail">
            {{ formatAddress(props.historyConfiguration[0]?.initial?.address) }}
          </div>
        </div>
      </contenthistory>
      <div class = "recoil">
        <button class="expand-history" @click="toggleHistory">
          Linha do tempo
        </button>
      </div>
    </div>
    <Loading v-if="props.loading" />
    <ul class="history-container" v-show="showHistory && !props.loading">
      <HistoryDetail 
        v-for="(config, index) in props.historyConfiguration" 
        :key="index"
        :HistoryDetail="config"
      />
      <p v-if="props.historyConfiguration.length === 0" class="empty-history">Histórico Vazio</p>
    </ul>
    <div class="history-container">
      <contenthistory class="history-entry">
        <div class="end-icon"></div>
        <div class="grid">
          <div class="text-detail">
            {{ formatDateTime(props.historyConfiguration[historyConfiguration.length - 1]?.initDateTime) }}
          </div>
          <div class="text-detail">
            {{ formatAddress(props.historyConfiguration[historyConfiguration.length - 1]?.finality?.address) }}
          </div>
        </div>
      </contenthistory>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import HistoryDetail from './HistoryDetail.vue'
import Loading from '@/components/Loading.vue'
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'
import { getClick } from '@/components/stores/StoreGetClick.js'
import type { HistoryConfig } from './Types'

const store = darkModeClick()
const storeFilters = getClick()

const props = defineProps<{
  historyConfiguration: Array<HistoryConfig>
  loading: boolean
}>()

const showHistory = ref(false)
const isDarkMode = computed(() => store.onClickDarkMode)

function toggleHistory() {
  showHistory.value = !showHistory.value
}

function formatDateTime(dateString: string): string {
  if (!dateString) return 'Data e horário indisponíveis'

  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatAddress(address: { road: string, town: string, state: string, country: string }): string {
  if (!address) return 'Endereço indisponível'
  return `${address.road} - ${address.town} - ${address.state} - ${address.country}`
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.history-wrapper {
  background-color: transparent;
  border-radius: 5px;
}

.history-title {
  color: #000;
  font-weight: 500;
  font-size: 12px;
  margin: 5px 0;
}

.history-container {
  overflow: auto;
  max-height: 260px;
  padding: 2;
  display: grid;
  grid-template-rows: auto;
  align-items: center;
}

.history-entry {
  display: grid;
  grid-template-columns: 10% 90%;
  width: 100%;
  border-radius: 8px;
  background-color: #6D6D6D;
  padding: 0;
  align-items: center;
  justify-items: center;
}

.start-icon, .end-icon {
  width: 30px;
  height: 30px;
  background-size: 75%;
  background-repeat: no-repeat;
  background-position: center;
}

.start-icon {
  background-image: url('@/assets/IconStartPin.png');
}

.end-icon {
  background-image: url('@/assets/IconEndPin.png');
}

.text-detail {
  font-size: 12px;
  color: #FFF;
}

.grid {
  display: grid;
  grid-template-rows: 50% 50%;
  padding: 5px;
  width: 100%;
}

.expand-history {
  border:3px solid transparent;
  border-radius: 10px;
  width: 100%;
  background-color: #6D6D6D;
  color: #FFF;
  font-size: 11px;
  padding: 1%;
  font-weight:600;
  cursor: pointer;
  text-align: center;
}

.empty-history {
  text-align: center;
}

.dark-mode .history-entry{
  border: 1px solid #555555;
}

.dark-mode .expand-history{
  background-color: #5f5f5f;
  border-color:3px solid transparent;
}

.dark-mode .history-title,
.dark-mode .text-detail,
.dark-mode .expand-history {
  color: #FFF;
}

.recoil{
  background: transparent;
  border: 4px solid transparent;
}
</style>
