<template>
  <li class="expanded-history">
    <div class="start-icon"></div>
    <div class="grid">
      <div class="text-detail">
        {{ formatDateTime(HistoryDetail?.endDateTime) }}
      </div>
      <div class="text-detail">
        {{ HistoryDetail?.initial?.address?.road }} -
        {{ HistoryDetail?.initial?.address?.town }} -
        {{ HistoryDetail?.initial?.address?.state }} -
        {{ HistoryDetail?.initial?.address?.country }}
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import type {HistoryContent} from './Types'

const props = defineProps<{
  HistoryDetail: HistoryContent
}>();

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

.start-icon {
  width: 30px;
  height: 30px;
  background-image: url('@/assets/IconStartPin.png');
  background-size: 75%;
  background-repeat: no-repeat;
  background-position: center;
}

.history-container {
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #3D3D3D;
  display: grid;
  grid-template-rows: repeat(auto, 100%);
  height: 100%;
  padding: 0;
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
  font-size: 13px;
  font-family: 'Poppins', regular, sans-serif;
  resize: none;
  box-sizing: border-box;
  cursor: default;
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
  