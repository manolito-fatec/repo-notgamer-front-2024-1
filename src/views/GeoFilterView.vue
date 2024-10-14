<template>
  <div class="filter-container">
    <Sidebar @toggle-filters="toggleFilters"/>
    <div v-if="showFilters" class="filters">
      <PersonSearch
          id="autocomplete1"
          label="Colaborador:"
          v-model="Person"
          :options="PersonOption"
          :reset="resetFilters"
          @update:modelValue="onPersonSelect"
      />
      <DropDown
          id="dropdown2"
          v-model="Device"
          :options="DeviceOption"
          label="Dispositivos:"
      />
      <DataRangePicker
          v-model:startDate="startDate"
          v-model:endDate="endDate"
          :reset="resetFilters"
          @update:startDate="startDate = $event"
          @update:endDate="endDate = $event"
          @update:selectedPeriod="selectedPeriod = $event"
      />
      <div class="button-group">
        <ClearButton class="full-width" @click="handleReset"></ClearButton>
        <StartButton class="full-width" @click="handleSave"></StartButton>
      </div>
      <History/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {fetchDevices, fetchPersons} from "@/services/apiService.js";
import Sidebar from "@/components/SideBar.vue";
import DataRangePicker from "@/components/filter/DateRangePicker.vue";
import DropDown from "@/components/filter/DropDown.vue";
import History from "@/components/History.vue";
import ClearButton from "@/components/ClearButton.vue";
import StartButton from "@/components/StartButton.vue";
import PersonSearch from "@/components/PersonSearch.vue";
import {errorHandler} from "@/utils/errorHandler";
import {useToast} from "vue-toastification";

const toast = useToast();
const Person = ref(null);
const Device = ref(null);
const PersonOption = ref([]);
const DeviceOption = ref([]);
const originalPersonOption = ref([]);
const showFilters = ref(false);
const isPersonSelected = ref(false);
const startDate = ref(null);
const endDate = ref(null);
const selectedPeriod = ref('');
const resetFilters = ref(false);

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
    errorHandler(error, toast);
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
      errorHandler(error, toast);
    }
  }
};

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

const emit = defineEmits(['saveFilter']);

function handleSave() {
  const filterData = {
    person: Person.value,
    startDate: startDate.value,
    endDate: endDate.value
  };
  emit('saveFilter', filterData);

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

  if (!hasErrors) {
    const filterData = {
      person: Person.value,
      device: Device.value,
      startDate: startDate.value,
      endDate: endDate.value
    };
    emit('saveFilter', filterData);
  }
}

function handleReset() {
  Person.value = null;
  Device.value = null;
  DeviceOption.value = [];
  startDate.value = null;
  endDate.value = null;
  selectedPeriod.value = '';

  resetFilters.value = true;
  setTimeout(() => {
    resetFilters.value = false;
  }, 0);
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}

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

.button-group {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.full-width {
  flex: 1;
}
</style>