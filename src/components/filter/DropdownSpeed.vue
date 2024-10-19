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

function watchChanges(newValue) {
  const select = document.getElementById('select')
  const icon = document.getElementById('icon')
  
  if (newValue) {
    icon.style.left = '595px';
    select.style.left = '595px';
  } else {
    icon.style.left = '190px';
    select.style.left = '190px';
  }
}

watch(
  () => store.onClickFilters,
  (newValue) => {
    watchChanges(newValue)
  }
);

onMounted(() => {
  watchChanges(store.onClickFilters);
})

</script>

<style scoped>

.dropdown-speed select {
width: 30px;
height: 30px;
background-color: transparent;
cursor: pointer;
border: none;
position: fixed;
appearance: none; 
color: transparent;
bottom: 10px;
left: 190px;
}

.dropdown-speed option {
color: white;
background-color: #202020;
}

.select-speed {
background-color: transparent;
border: none; 
color: white;
font-size: 30px;
cursor: pointer; 
position: fixed;
display: flex;
bottom: 10px;
left: 190px;
}

</style>