<template>
  <div class="filter-container">
    <button class="toggle-button" @click="toggleFilters">
      <IconFilter />
    </button>

    <div v-if="showFilters" class="filters">
      <DataRangePicker />
      <DropDown
          id="dropdown1"
          label="Selecione o tipo"
          v-model="selectedOption1"
          :options="options1"
      />
      <DropDown
          id="dropdown2"
          label="Selecione a origem dos dados"
          v-model="selectedOption2"
          :options="options2"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IconFilter from "@/components/icons/IconFilter.vue";
import DataRangePicker from "@/components/filter/DateRangePicker.vue";
import DropDown from "@/components/filter/DropDown.vue";

const selectedOption1 = ref(null)
const selectedOption2 = ref(null)

const options1 = [
  { label: 'Pessoa', value: 'p' },
  { label: 'Veículo', value: 'v' }
]

const options2 = [
  {label: 'Wearables', value: 'w'},
  {label: 'Smartphone', value: 's'},
  {label: 'Tags', value: 't'}
]

const showFilters = ref(false)

function toggleFilters() {
  showFilters.value = !showFilters.value
}
</script>

<style scoped>
.filter-container {
  position: relative;
}

.toggle-button {
  position: fixed;
  top: 16px;
  left: 16px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filters {
  position: fixed;
  top: 16px;
  left: calc(16px + 70px);
  padding: 16px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}
</style>
