<template>
  <div class="date-range-container" id="filter-label2">
    <DropDown
      id="periodDropdown"
      label="Período:"
      v-model="selectedPeriod"
      :options="periodOptions"
      @change="updateDateRange"
    />

    <div class="date-range">
      <input
        type="date"
        v-model="startDate"
        @change="onStartDateChange"
        class="filter-input date-input"
        ref="startDateInput"
      />
      <span class="date-range-separator" ref="separator">-</span>
      <input
        type="date"
        v-model="endDate"
        @change="onEndDateChange"
        class="filter-input date-input"
        ref="endDateInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import DropDown from "@/components/filter/DropDown.vue";
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';

const emit = defineEmits(['update:startDate', 'update:endDate', 'update:selectedPeriod']);
const startDate = ref(null);
const endDate = ref(null);
const selectedPeriod = ref('');
const store = darkModeClick();

const props = defineProps({
  reset: Boolean,
  lightModeTextColor: { type: String, default: "#fff" },
  lightModeBgColor: { type: String, default: "#6D6D6D" },
  darkModeTextColor: { type: String, default: "#FFF" },
  darkModeBgColor: { type: String, default: "#444444" }
});

const startDateInput = ref(null);
const endDateInput = ref(null);
const separator = ref(null);

watch(() => props.reset, (newValue) => {
  if (newValue) {
    selectedPeriod.value = '';
    startDate.value = null;
    endDate.value = null;
    emit('update:startDate', null);
    emit('update:endDate', null);
    emit('update:selectedPeriod', '');
  }
});

const periodOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Última semana', value: 'lastWeek' },
  { label: 'Último mês', value: 'lastMonth' },
];

function updateDateRange() {
  const today = new Date().toISOString().split('T')[0];
  if (selectedPeriod.value === 'today') {
    startDate.value = today;
    endDate.value = today;
  }
  if (selectedPeriod.value === 'lastWeek') {
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    startDate.value = lastWeekStart.toISOString().split('T')[0];
    endDate.value = lastWeekEnd.toISOString().split('T')[0];
  }
  if (selectedPeriod.value === 'lastMonth') {
    const lastMonthStart = new Date();
    lastMonthStart.setDate(1);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthEnd = new Date();
    lastMonthEnd.setMonth(lastMonthEnd.getMonth(), 0);
    startDate.value = lastMonthStart.toISOString().split('T')[0];
    endDate.value = lastMonthEnd.toISOString().split('T')[0];
  }

  emit('update:startDate', startDate.value);
  emit('update:endDate', endDate.value);
}

watch([startDate, endDate], ([newStartDate, newEndDate]) => {
  if (newStartDate && newEndDate) {
    emit('update:startDate', newStartDate);
    emit('update:endDate', newEndDate);
  }
});

function onStartDateChange() {
  selectedPeriod.value = '';
  endDate.value = null;
  updateDateRange();
}

function onEndDateChange() {
  selectedPeriod.value = '';
  emit('update:endDate', endDate.value);
}

function updateDateInputColors() {
  if (startDateInput.value && endDateInput.value && separator.value) {
    const isDarkMode = store.onClickDarkMode;

    const textColor = isDarkMode ? props.darkModeTextColor : props.lightModeTextColor;
    const backgroundColor = isDarkMode ? props.darkModeBgColor : props.lightModeBgColor;

    startDateInput.value.style.color = textColor;
    startDateInput.value.style.backgroundColor = backgroundColor;
    endDateInput.value.style.color = textColor;
    endDateInput.value.style.backgroundColor = backgroundColor;
    separator.value.style.color = textColor;
  }
}

onMounted(() => {
  updateDateInputColors();
});

watch(
  () => store.onClickDarkMode,
  () => {
    updateDateInputColors();
  }
);
</script>

<style scoped>
.date-range-container {
  margin-bottom: 8px;
  font-size: 15px;
}

.date-range {
  display: flex;
  align-items: center;
}

.date-input {
  width: calc(48.7% - 8px);
  padding: 5px 12px;
  border: 1px solid #555555;
  border-radius: 4px;
  outline: none;
}

.date-range-separator {
  margin: 0 8px;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
