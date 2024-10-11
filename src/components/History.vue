<template>
  <div class="history-wrapper">
    <h2 class="history-title">Histórico:</h2>
      <ul class="history-container">
        <contenthistory>
          <div class="start-icon"></div>
          <textarea v-model="historyText" readonly></textarea>
        </contenthistory>
        <button class="expand-history" @click="expandItems">Linha do tempo
          <div class = "icon-expand"></div>
        </button>
        <HistoryDetail v-if="showHistory" 
          v-for="(point, index) in points" 
          :historyText="historyText">
        </HistoryDetail>
        <contenthistory>
          <div class="end-icon"></div>
          <textarea v-model="historyText" readonly></textarea>
        </contenthistory>
      </ul>
    <Observer
       v-if="!(infinteScrollOptions.currentPage > infinteScrollOptions.maxPage)" 
       @is-in-view="handleIsInView"
        @is-outside-view="handleIsOutsideView" />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import iconIn from './icons/iconIn.vue';
import iconOut from './icons/iconOut.vue';
import iconExpand from './icons/iconExpand.vue';
import HistoryDetail from './HistoryDetail.vue';
import Observer from './Observer.vue';
import { throttle } from 'lodash';

const showHistory = ref (false)
const historyText = ref('dd/mm/aaaa hh:mm:ss\n[bairro] - [av/rua], [cidade] - [estado]')

function expandItems(){
  showHistory .value= !showHistory.value
}

const infinteScrollOptions = {
  maxPage: 100,
  limitsPerPage: 1,
  currentPage: 1,
  isInView: false
}
const points = ref(getPoints(infinteScrollOptions.limitsPerPage, infinteScrollOptions.currentPage))

const handleLoadmore  = throttle(function(options = infinteScrollOptions) {
  const { limitsPerPage, currentPage, isInView, maxPage } = options
  if (currentPage > maxPage) return
  const newCurrentPage = currentPage + 1
  infinteScrollOptions.currentPage = newCurrentPage
  const newPoints = getPoints(limitsPerPage, newCurrentPage)
  points.value = [...points.value, ...newPoints];
  if (isInView) {
    handleLoadmore()
  }
}, 300, { leading: true, trailing: true })
	
function handleIsInView() {
  infinteScrollOptions.isInView = true
  handleLoadmore()
}

function handleIsOutsideView() {
  infinteScrollOptions.isInView = false
}

function getPoints(limitsPerPage, currentPage) {
  return Array.from({ length: limitsPerPage }, () => ({ title: currentPage.toString() }));
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.history-wrapper {
  margin-top: 8px;
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
  margin-bottom: 8px;
  font-size: 11px;
  font-family: Arial, sans-serif;
}

.history-container {
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #3D3D3D;
  display: flexbox;
  grid-template-rows: repeat(auto, 100%);
  height: 200%;
  padding: 0%;
  align-items: center;
  justify-items: center;
  row-gap: 2%;
}

.history-container textarea {
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

</style>
