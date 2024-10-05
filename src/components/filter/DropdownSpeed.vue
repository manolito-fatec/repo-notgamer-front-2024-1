<template>
  <div class="dropdown-speed">
    <i class="fa-solid fa-gauge select-speed"></i>
    <select class="dropdown-select" :value="modelValue" @change="onChange">
      <option value="0.5x">0.5x</option>
      <option value="1x">1x</option>
      <option value="2x">2x</option>
    </select> 
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);

function onChange(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', selectedValue);
}

</script>

<style scoped>

.dropdown-speed select {
width: 30px;
height: 30px;
position: absolute;
background-color: transparent;
cursor: pointer;
border: none;
appearance: none; 
color: transparent;
bottom: 10px;
left: 90px;
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
position: absolute;
display: flex;
bottom: 10px;
left: 90px;
}

</style>