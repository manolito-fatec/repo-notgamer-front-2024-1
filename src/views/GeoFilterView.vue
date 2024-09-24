<template>
  <div class="filter-container">
    <Sidebar @toggle-filters="toggleFilters"/>
    <div v-if="showFilters" class="filters">
      <DropDown
          id="dropdown1"
          label="Colaborador:"
          v-model="Person"
          :options="PersonOption"
          @change="onPersonSelect"
      />
      <DropDown
          id="dropdown2"
          label="Dispositivos:"
          v-model="Device"
          :options="DeviceOption"
      />
      <DataRangePicker
          v-model:startDate="startDate"
          v-model:endDate="endDate"
      />
      <div class="button-group">
        <ClearButton class="full-width" @click="handleReset"></ClearButton>
        <StartButton class="full-width" @click="handleStart"></StartButton>
      </div>
      <History />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Sidebar from "@/components/Sidebar.vue";
import DataRangePicker from "@/components/filter/DateRangePicker.vue";
import DropDown from "@/components/filter/DropDown.vue";
import History from "@/components/History.vue";
import ClearButton from "@/components/ClearButton.vue";
import StartButton from "@/components/StartButton.vue";

const Person = ref(null);
const Device = ref(null);
const PersonOption = ref([]);
const DeviceOption = ref([]);
const originalPersonOption = ref([]);
const showFilters = ref(false);
const isPersonSelected = ref(false);
const startDate = ref(null);
const endDate = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('https://gist.githubusercontent.com/pauloarantesmachado/e1dae04eaf471fcf13e76488c1b9051d/raw/6addd4c29581aa372e8fa8df1670c99104816d9f/gistfile1.json');
    PersonOption.value = response.data
        .map(person => ({
          label: person.person.fullname,
          value: person.person.id
        }))
        .filter((person, index, self) =>
            index === self.findIndex(p => p.label === person.label)
        );

    originalPersonOption.value = [...PersonOption.value];
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error);
  }
});

const onPersonSelect = async (selectedPerson) => {
  if (selectedPerson) {
    isPersonSelected.value = true;

    try {
      const response = await axios.get('https://gist.githubusercontent.com/pauloarantesmachado/e1dae04eaf471fcf13e76488c1b9051d/raw/6addd4c29581aa372e8fa8df1670c99104816d9f/gistfile1.json');
      DeviceOption.value = response.data
          .map(person => ({
            label: person.person.codeDevice,
            value: person.person.id
          }))
          .filter((person, index, self) =>
              index === self.findIndex(p => p.label === person.label)
          );
    } catch (error) {
      console.log("Erro ao buscar dispositivos:", error);
    }
  }
};

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function handleStart() {
}

function handleSave() {
  const filterData = {
    person: Person.value,
    device: Device.value,
    startDate: startDate.value,
    endDate: endDate.value
  };

  console.log("Dados dos filtros:", filterData);
}

function handleReset() {
  Person.value = null;
  Device.value = null;
  DeviceOption.value = [];
  startDate.value = null;
  endDate.value = null;
}
</script>


<style scoped>
.filters {
  position: fixed;
  top: 0;
  left: 75px;
  width: 320px;
  height: 100%;
  padding: 16px;
  background: linear-gradient(180deg, #262626 0%, #3A3A3A 50%, #262626 100%);
  border-left: 4px solid #EC1C24;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow-y: auto;
  transition: left 0.5s ease;
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