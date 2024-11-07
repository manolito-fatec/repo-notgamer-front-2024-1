<template>
  <div class="filter-container">
    <Sidebar
        @toggle-filters="toggleFilters"
        @toggle-zone="toggleZone"
        :showFilters="showFilters"
        :showZone="showZone"
    />
    <div v-if="showFilters" class="filters">
      <PersonSearch
          id="autocomplete1"
          v-model="Person"
          :options="PersonOption"
          :reset="resetFilters"
          label="Colaborador:"
          @update:modelValue="onPersonSelect"
      />
      <DropDown
          id="dropdown2"
          v-model="Device"
          :options="DeviceOption"
          label="Dispositivos:"
      />
      <DropDown
        id="dropdown3"
        v-model="Zone"
        :options="ZoneOption"
        label="Zonas de interesse:"
      />
      <DataRangePicker
          v-model:endDate="endDate"
          v-model:startDate="startDate"
          :reset="resetFilters"
          @update:startDate="startDate = $event"
          @update:endDate="endDate = $event"
          @update:selectedPeriod="selectedPeriod = $event"
      />
      <div class="button-group">
        <ClearButton class="full-width" @click="handleReset"></ClearButton>
        <StartButton class="full-width" @click="handleSave"></StartButton>
      </div>
      <div>
        <History :historyConfiguration="listOfHistory" :loading="loading"/>
      </div>
    </div>
    <div v-if="showZone" class="zone-component">
      <InterestZone
          @saveDraw="saveDraw"
          @toggleDrawing="toggleDrawing"
          @drawType="drawType"
          @changeZoneName="changeZoneName"
          @toggleZoneVisibility="$emit('toggleZoneVisibility')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {fetchDevices, fetchPersons} from "@/services/apiService.ts";
import Sidebar from "@/components/SideBar.vue";
import DataRangePicker from "@/components/filter/DateRangePicker.vue";
import DropDown from "@/components/filter/DropDown.vue";
import History from "@/components/History.vue";
import ClearButton from "@/components/ClearButton.vue";
import StartButton from "@/components/StartButton.vue";
import PersonSearch from "@/components/PersonSearch.vue";
import {handleAxiosError} from "@/utils/errorHandler";
import {useToast} from "vue-toastification";
import {fetchHistory} from '../services/apiService.ts';
import InterestZone from "@/components/InterestZone.vue";

const emit = defineEmits(['saveFilter', 'clearPoints', 'toggleSvgColor', 'saveDraw','toggleDrawing','drawType','changeZoneName','toggleZoneVisibility']);
const toast = useToast();
const Person = ref(null);
const Device = ref(null);
const PersonOption = ref([]);
const DeviceOption = ref([]);
const ZoneOption = ref([]);
const listOfHistory = ref([]);
const originalPersonOption = ref([]);
const showFilters = ref(false);
const showZone = ref(false);
const isPersonSelected = ref(false);
const startDate = ref(null);
const loading = ref(false);
const endDate = ref(null);
const selectedPeriod = ref('');
const resetFilters = ref(false);
const selectedMode = ref(null);

function drawType(selectedMode:selectedMode){
  emit("drawType", selectedMode);
}
function saveDraw(){
  emit("saveDraw");
}
function toggleDrawing(){
  emit("toggleDrawing")
}
function changeZoneName(changeZoneName:changeZoneName){
  emit("changeZoneName", changeZoneName);
}

onMounted(async () => {
  try {
    let personListFromDb = await fetchPersons();
    PersonOption.value = personListFromDb.map(person => ({
      label: person.fullName.toUpperCase(),
      value: person.idPerson
    })).filter((person, index, self) =>
        index === self.findIndex(p => p.label === person.label)
    );
    originalPersonOption.value = [...PersonOption.value];
  } catch (error) {
    console.error("Erro ao inicializar opções de pessoas:", error);
    handleAxiosError(error, toast);
  }
});

const onPersonSelect = async (selectedPerson) => {
  Person.value = selectedPerson;
  if (selectedPerson != null) {
    isPersonSelected.value = true;
    try {
      const allDevices = await fetchDevices();
      const filteredDevices = allDevices.filter(device => {
        return device.value === selectedPerson;
      });
      DeviceOption.value = filteredDevices;
      if (filteredDevices.length > 0) {
        Device.value = filteredDevices[0].value;
      } else {
        Device.value = null;
      }
    } catch (error) {
      console.log("Erro ao buscar dispositivos:", error);
      handleAxiosError(error, toast);
    }
  }
};


function toggleFilters() {
  showFilters.value = !showFilters.value;
  if (showFilters.value) {
    showZone.value = false;
  }
}

function toggleZone() {
  showZone.value = !showZone.value;
  if (showZone.value) {
    showFilters.value = false;
  }
}

function handleSave() {
  let hasErrors = false;

  if (!Person.value) {
    toast.error("Por favor, selecione um colaborador.");
    hasErrors = true;
  }
  if (!Device.value) {
    toast.error("Por favor, selecione um dispositivo.");
    hasErrors = true;
  }
  if (!startDate.value) {
    toast.error("Por favor, selecione uma data de início.");
    hasErrors = true;
  }
  if (!endDate.value) {
    toast.error("Por favor, selecione uma data de fim.");
    hasErrors = true;
  }

  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (end < start) {
      toast.error("A data de fim deve ser superior à data de início.");
      hasErrors = true;
    } else {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 31) {
        toast.error("O intervalo selecionado não pode ser maior que 31 dias.");
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      const filterData = {
        person: Person.value,
        device: Device.value,
        startDate: startDate.value,
        endDate: endDate.value
      };
      emit('saveFilter', filterData);
      loading.value = true;
      getHistory(filterData.person, filterData.startDate, filterData.endDate);
    }
  }
}

const getHistory = async (person, startDate, endDate) => {
  try {
    const historyRequest = await fetchHistory(person, startDate, endDate);
    listOfHistory.value = historyRequest;
    loading.value = false;
  } catch (error) {
    console.error(error)
    toast.error("Erro ao buscar histórico. Tente novamente mais tarde.")
  }
}

function handleReset() {
  Person.value = null;
  Device.value = null;
  DeviceOption.value = [];
  startDate.value = null;
  endDate.value = null;
  selectedPeriod.value = '';
  listOfHistory.value = [];

  resetFilters.value = true;
  setTimeout(() => {
    resetFilters.value = false;
  }, 0);

  emit('clearPoints');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.filters {
  position: fixed;
  top: 0;
  left: 100px;
  width: 420px;
  height: 100%;
  padding: 16px;
  background: linear-gradient(180deg, #262626 0%, #3A3A3A 50%, #262626 100%);
  border-left: 4px solid #EC1C24;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: left 0.5s ease;
  font-family: 'Poppins', regular, sans-serif;
  z-index: 10;
}

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}
listIsEmpty
.full-width {
  flex: 1;
}
</style>