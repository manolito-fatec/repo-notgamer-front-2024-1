<template>
  <div class="filter-container">
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
</template>

<script setup>
import { ref } from 'vue'
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
</script>

<style scoped>
.filter-container {
  padding: 16px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
