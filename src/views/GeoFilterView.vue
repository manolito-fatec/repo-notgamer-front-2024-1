<template>
  <div class="filter-container" >
    <Sidebar
        @toggle-filters="toggleFilters"
        @toggle-zone="toggleZone"
        :showFilters="showFilters"
        :showZone="showZone"
    />
    <div v-show="showFilters" class="filters" id="filters">
      <div class="title" id="title">FILTRAR</div>
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
      <InterestZone>
      </InterestZone>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
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
import {darkModeClick} from '@/components/stores/StoreDarkModeGetClick.js'
import {getClick} from '@/components/stores/StoreGetClick.js'

const emit = defineEmits(['saveFilter', 'clearPoints', 'toggleSvgColor']);
const toast = useToast();
const Person = ref(null);
const Device = ref(null);
const PersonOption = ref([]);
const DeviceOption = ref([]);
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
const store = darkModeClick();
const storeFilters = getClick();

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
    listOfHistory.value = await fetchHistory(person, startDate, endDate);
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

watch(() => store.onClickDarkMode && storeFilters.onClickFilters,
  () => {

  const filter = document.getElementById('filters')
  const title = document.getElementById('title')

  if (store.onClickDarkMode && storeFilters.onClickFilters){
    filter.style.borderRight = "4px solid #EC1C24";
    filter.style.background = "#262626";
    title.style.color = "#FFF";
  } else {
    filter.style.borderRight = "4px solid #000059",
    filter.style.background = "#EFEFEF",
    title.style.color = "#000";
  }
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.filters {
  position: fixed;
  top: 3%;
  left: 100px;
  width: 380px;
  height: 87%;
  padding: 16px;
  border-right: 4px solid #000059;
  background: #EFEFEF;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: left 0.5s ease;
  font-family: 'Poppins', regular, sans-serif;
  font-size: 12px;
  z-index: 10;
  text:#fff;
}

.title {
  font-family: 'Poppins', regular, sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #000;
  padding-bottom: 0%;
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

.filter-container ::-webkit-scrollbar {
  width: 5px;
  }

.filter-container ::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background: #A0A0A080;
}

.filter-container ::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 50px;
}
</style>