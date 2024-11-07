<template>
  <div class="filter-item" id="dropdown0">
    <label :for="id" class="filter-label" ref="filterLabel">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      class="filter-input"
      :class="dropdownClasses"
      @input="$emit('update:modelValue', $event.target.value)"
      ref="filterInput"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :class="dropdownOptionClasses"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { watch, ref, computed, onMounted } from 'vue';
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';
import { getClick } from '@/components/stores/StoreGetClick.js';

const store = darkModeClick();
const storeFilters = getClick();

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: Array,
});

const filterLabel = ref(null);
const filterInput = ref(null);

// Classes dinâmicas para o modo claro/escuro
const dropdownClasses = computed(() => ({
  'dark-mode': store.onClickDarkMode && storeFilters.onClickFilters,
  'light-mode': !(store.onClickDarkMode && storeFilters.onClickFilters),
}));

const dropdownOptionClasses = computed(() => ({
  'option-dark-mode': store.onClickDarkMode && storeFilters.onClickFilters,
  'option-light-mode': !(store.onClickDarkMode && storeFilters.onClickFilters),
}));

const updateLabelColor = () => {
  if (filterLabel.value) {
    filterLabel.value.style.color = store.onClickDarkMode && storeFilters.onClickFilters ? "#fff" : "#000";
  }
};

watch(
  () => [store.onClickDarkMode, storeFilters.onClickFilters], 
  () => {
    updateLabelColor();
  },
  { immediate: true } 
);

onMounted(() => {
  updateLabelColor();
});
</script>

<style scoped>
.filter-item {
  margin-bottom: 8px;
}

.filter-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 12px;
}

.filter-input {
  width: 100%;
  padding: 5px 12px;
  border: 1px solid #555555;
  border-radius: 6px;
  font-size: 12px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.filter-input.dark-mode {
  background-color: #444444;
  color: #fff;
}

.filter-input.light-mode {
  background-color: #6D6D6D;
  color: #fff;
}

.filter-input:focus {
  border: 1px solid #888888;
  box-shadow: 0 0 5px rgba(136, 136, 136, 0.5);
}

.filter-input:hover {
  background-color: #555555;
}

.option-dark-mode {
  background-color: #444444;
  color: #fff;
}

.option-light-mode {
  background-color: #444444;
  color: #fff;
}
</style>
