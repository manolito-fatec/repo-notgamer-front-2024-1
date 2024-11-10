<template>
  <div class="dropdown-speed">
    <i id="icon" class="fa-solid fa-gauge select-speed"></i>
    <select id="select" class="dropdown-select" :value="modelValue" @change="onChange">
      <option value="0.5x">0.5x</option>
      <option value="1x">1x</option>
      <option value="2x">2x</option>
    </select> 
  </div>
</template>

<script setup lang="ts">
import { getClick } from '@/components/stores/StoreGetClick.js' 
import { defineEmits, onMounted, watch } from 'vue';

const store = getClick();

const emit = defineEmits(['update:modelValue']);

function onChange(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', selectedValue);
}

</script>

<style scoped>

.dropdown-speed select {
width: 25px;
height: 25px;
background-color: transparent;
cursor: pointer;
border: none;
position: fixed;
appearance: none; 
color: transparent;
bottom: 13px;
}

.dropdown-speed option {
color: white;
background-color: #202020;
}

.select-speed {
background-color: transparent;
border: none; 
color: white;
font-size: 25px;
cursor: pointer; 
display: flex;
bottom: 10px;
}

</style>