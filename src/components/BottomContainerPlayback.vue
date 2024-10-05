<template>
  <div class="control-movement">
    <div class = "reproduction-bar">
      <input 
      id="speed" 
      type="range" 
      min="0" 
      :max="duration" 
      v-model="elapsedTime" 
      @input="changeColor">
    </div>
    <!-- <div class = "arrow-up"></div> -->
    <div class="date">
      <h6> 19/09/2024 <br> 17:38</h6>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const duration = ref(10000);
const elapsedTime = ref(0);

function changeColor(event: Event) {
  const percentage = (event.target.value / duration.value) * 100;
  event.target.style.setProperty('--elapsedTime', `${percentage}%`);
}

</script>

<style scoped>

.control-movement {
  width: 94.6%;
  height: 50px;
  position: fixed;
  display: flex;
  bottom: 0px;
  background: linear-gradient(rgb(50, 50, 50), rgb(0, 0, 0));
  opacity: 70%;
}

.reproduction-bar {
  width: 100%;
  position: absolute;
  display: flex;
  bottom: 50px;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  outline: none;
  border-radius: 30px;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  border-radius: 3px;
  cursor: pointer;
  background: linear-gradient(to right, #EC1C24 0%, #EC1C24 var(--elapsedTime), #FFFFFF var(--elapsedTime), #FFFFFF 100%);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: #EC1C24;
  cursor: pointer;
  border-radius: 30px;
  margin-top: -5px; 
}

.date { 
  color: white;
  font-size: 30px;
  position: absolute;
  display: flex;
  bottom: 0px;
  left: 140px;
}

</style>