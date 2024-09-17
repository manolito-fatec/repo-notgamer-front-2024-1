<template>
  <div class="filter-container">
    <Sidebar @toggle-filters="toggleFilters"/>
    <div v-if="showFilters" class="filters">
      <DropDown
          id="dropdown1"
          label="Colaborador:"
          v-model="Person"
          :options="PersonOption"
      />
      <DropDown
          id="dropdown2"
          label="Dispositivos:"
          v-model="Device"
          :options="DeviceOption"
      />
      <DropDown
          id="dropdown3"
          label="Periodo"
          v-model="Period"
          :options="PeriodOption"
      />
      <DataRangePicker
      />
      <div class="button-group">
        <ClearButton
            class="full-width" @click="handleSave">Salvar
        </ClearButton>
        <StartButton
            class="full-width" @click="handleReset">Resetar
        </StartButton>
      </div>
      <History
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from "@/components/Sidebar.vue";
import DataRangePicker from "@/components/filter/DateRangePicker.vue";
import DropDown from "@/components/filter/DropDown.vue";
import History from "@/components/History.vue";
import ClearButton from "@/components/ClearButton.vue";
import StartButton from "@/components/StartButton.vue";

const Person = ref(null);
const Device = ref(null);
const Period = ref(null);

const PersonOption = [
  { label: 'Pessoas', value: 'p' },
];

const DeviceOption = [
  { label: 'Wearables', value: 'w' },
  { label: 'Smartphone', value: 's' },
  { label: 'Tags', value: 't' }
];

const PeriodOption = [
  { label: 'Hoje', value: 'today' },
  { label: 'Última semana', value: 'lastWeek' },
  { label: 'Último mês', value: 'lastMonth' }
];

const showFilters = ref(false);

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function handleSave() {
}

function handleReset() {
}
</script>

<style scoped>
.filters {
  position: fixed;
  top: 0;
  left: 150px;
  width: 320px;
  height: 100vh;
  padding: 16px;
  background: linear-gradient(180deg, #262626 0%, #000000 35%, #3A3A3A 52%, #262626 100%);
  border-left: 4px solid red;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow-y: auto;
  transition: left 0.3s ease;
}

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.full-width {
  flex: 1;
}
</style>