<template>
  <div ref="filterItem" class="filter-item">
    <label :for="id" class="filter-label" ref="filterLabel">{{ label }}</label>
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
        :style="suggestionItemStyle"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';
import { getClick } from '@/components/stores/StoreGetClick.js';

const store = darkModeClick();
const storeFilters = getClick();

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: Array,
  reset: Boolean,
  lightModeTextColor: { type: String, default: "#FFF" },
  lightModeBgColor: { type: String, default: "#6D6D6D" },
  darkModeTextColor: { type: String, default: "#FFF" },
  darkModeBgColor: { type: String, default: "#444444" }
});

const emit = defineEmits(['update:modelValue']);
const searchTerm = ref('');
const filteredOptions = ref([]);
const filterItem = ref(null);
const filterLabel = ref(null);
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

function updateFilterColors() {
  const isDarkMode = store.onClickDarkMode && storeFilters.onClickFilters;
  const textColor = isDarkMode ? props.darkModeTextColor : props.lightModeTextColor;
  const textLabel = isDarkMode ? "#FFF" : "#000";
  const backgroundColor = isDarkMode ? props.darkModeBgColor : props.lightModeBgColor;

  if (filterLabel.value) {
    filterLabel.value.style.color = textLabel;
  }
  if (inputField.value) {
    inputField.value.style.color = textColor;
    inputField.value.style.backgroundColor = backgroundColor;
  }
}

const suggestionItemStyle = computed(() => {
  const isDarkMode = store.onClickDarkMode && storeFilters.onClickFilters;
  return {
    color: isDarkMode ? props.darkModeTextColor : props.lightModeTextColor,
    backgroundColor: isDarkMode ? props.darkModeBgColor : props.lightModeBgColor
  };
});

const placeholderStyle = computed(() => {
  const isDarkMode = store.onClickDarkMode && storeFilters.onClickFilters;
  return {
    color: isDarkMode ? props.darkModeTextColor : props.lightModeTextColor
  };
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  updateFilterColors();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(
  () => [store.onClickDarkMode, storeFilters.onClickFilters],
  () => {
    updateFilterColors();
  }
);
</script>

<style scoped>
.filter-item {
  margin-bottom: 8px;
  position: relative;
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
  position: absolute;
  width: 100%;
  z-index: 1000;
  border-radius: 4px;
}

.suggestion-item {
  padding: 5px;
  border-bottom: solid;
  border-color: #555555;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: #555555;
}

.filter-input::placeholder {
  transition: color 0.2s;
  color: var(--placeholder-color);
}
</style>
