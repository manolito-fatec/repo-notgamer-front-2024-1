<template>
  <div class="history-wrapper">
    <h2 class="history-title">Histórico:</h2>
    <div class="history-container">
      <contenthistory>
        <div class="start-icon"></div>
        <textarea v-model="historyText" readonly></textarea>
      </contenthistory>
        <button class="expand-history" @click="expandItems">Linha do tempo
        <div class = "icon-expand"></div>
      </button>
      <div v-if="showHistory" class = "expanded-history">
        <div class="start-icon"></div>
        <textarea v-model="historyText" readonly></textarea>
        <div class = "icon-in"></div>
      </div>
      <div v-if="showHistory" class="expanded-history">
        <div class="start-icon"></div>
        <textarea v-model="historyText" readonly></textarea>
        <div class = "icon-out"></div>
      </div>
      <contenthistory>
        <div class="end-icon"></div>
        <textarea v-model="historyText" readonly></textarea>
      </contenthistory>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import iconIn from './icons/iconIn.vue';
import iconOut from './icons/iconOut.vue';
import iconExpand from './icons/iconExpand.vue';
const historyText = ref('dd/mm/aaaa hh:mm:ss\n[bairro] - [av/rua], [cidade] - [estado]')
const showHistory = ref (false)

function expandItems(){
  showHistory .value= !showHistory.value
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.history-wrapper {
  margin-top: 16px;
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
  font-size: 16px;
  font-family: Arial, sans-serif;
}

.history-container {
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #3D3D3D;
  display: grid;
  grid-template-rows: repeat(auto, 100%);
  height: 100%;
  padding: 0%;
  align-items: cente;
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
