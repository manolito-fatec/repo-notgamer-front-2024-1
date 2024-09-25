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
        <StartButton class="full-width" @click="handleSave"></StartButton>
      </div>
      <History />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchPersons, fetchDevices} from "@/services/apiService.js";
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
    PersonOption.value = await fetchPersons();
    originalPersonOption.value = [...PersonOption.value];
  } catch (error) {
    console.error("Erro ao inicializar opções de pessoas:", error);
  }
});

const onPersonSelect = async (selectedPerson) => {
  if (selectedPerson) {
    isPersonSelected.value = true;

    try {
      DeviceOption.value = await fetchDevices();
    } catch (error) {
      console.log("Erro ao buscar dispositivos:", error);
    }
  }
};

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

const emit = defineEmits(['saveFilter'])

function handleSave() {
  const filterData = {
    person: Person.value,
    startDate: startDate.value,
    endDate: endDate.value
  };
  emit('saveFilter', filterData);

  // console.log("Dados dos filtros:", filterData.person);
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

@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
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
  font-family: 'Poppins', regular, sans-serif;
}
.poppins-regular {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
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