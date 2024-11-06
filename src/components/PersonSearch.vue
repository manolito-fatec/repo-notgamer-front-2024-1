<template>
  <div ref="filterItem" class="filter-item">
    <label :for="id" class="filter-label" id="filter-label">{{ label }}</label>
    <input
        ref="inputField"
        v-model="searchTerm"
        class="filter-input"
        placeholder="Digite para buscar..."
        type="text"
        @focus="handleFocus"
        @input="filterOptions"
        @keydown.enter="selectClosestOption"
    />
    <ul v-if="filteredOptions.length > 0" class="suggestions">
      <li
          v-for="option in filteredOptions"
          :key="option.value"
          class="suggestion-item"
          @click="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'
import { getClick } from '@/components/stores/StoreGetClick.js'

const store = darkModeClick();
const storeFilters = getClick();

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: Array,
  reset: Boolean
});

const emit = defineEmits(['update:modelValue']);

const searchTerm = ref('');
const filteredOptions = ref([]);
const filterItem = ref(null);
const inputField = ref(null);

watch(() => props.reset, (newValue) => {
  if (newValue) {
    searchTerm.value = '';
    emit('update:modelValue', null);
  }
});

function showAllOptions() {
  filteredOptions.value = props.options;
}

watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions;
});

function filterOptions() {
  if (!searchTerm.value) {
    filteredOptions.value = props.options;
  } else {
    filteredOptions.value = props.options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
}

function selectOption(option) {
  emit('update:modelValue', option.value);
  searchTerm.value = option.label;
  filteredOptions.value = [];
}

function selectClosestOption() {
  if (filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0]);
  }
}

function handleFocus() {
  if (searchTerm.value) {
    inputField.value.select();
  } else {
    showAllOptions();
  }
}

function handleClickOutside(event) {
  if (filterItem.value && !filterItem.value.contains(event.target)) {
    filteredOptions.value = [];
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});



watch(() => store.onClickDarkMode && storeFilters.onClickFilters,
  () => {
  const filterLabel = document.getElementById('filter-label')

  if (store.onClickDarkMode && storeFilters.onClickFilters) {
    filterLabel.style.color = "#FFF"

  } else {
    filterLabel.style.color = "#000"
    
  }
});

</script>

<style scoped>
.filter-item {
  margin-bottom: 8px;
  position: relative;
}

.filter-label {
  display: block;
  margin-bottom: 6px;
  color: #000;
  font-weight: 500;
  font-size: 12px;
}

.filter-input {
  width: 100%;
  padding: 5px 12px;
  border: 1px solid #555555;
  border-radius: 6px;
  background-color: #444444;
  font-size: 12px;
  color: #fff;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}

.filter-input:focus {
  border: 1px solid #888888;
  box-shadow: 0 0 5px rgba(136, 136, 136, 0.5);
}

.suggestions {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  border: 1px solid #888888;
  max-height: 150px;
  overflow-y: auto;
  background: #444444;
  position: absolute;
  width: 100%;
  z-index: 1000;
  border-radius: 4px;
}

.suggestion-item {
  padding: 5px;
  border-bottom:solid ;
  border-color: #555555;
  cursor: pointer;
  color: #ffffff;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: #555555;
}
</style>
