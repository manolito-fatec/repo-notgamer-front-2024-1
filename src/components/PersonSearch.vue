<template>
  <div class="filter-item">
    <label :for="id" class="filter-label">{{ label }}</label>
    <input
        type="text"
        v-model="searchTerm"
        @focus="showAllOptions"
        @input="filterOptions"
        placeholder="Digite para buscar..."
        class="filter-input"
    />
    <ul v-if="filteredOptions.length > 0" class="suggestions">
      <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="suggestion-item"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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
</script>

<style scoped>
.filter-item {
  margin-bottom: 8px;
}

.filter-label {
  display: block;
  margin-bottom: 8px;
  color: #ffffff;
}

.filter-input {
  width: 100%;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background-color: #444444;
  color: #fff;
}

.suggestions {
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  background: #444444;
  position: absolute;
  width: 90%;
  z-index: 1000;
}

.suggestion-item {
  padding: 8px;
  cursor: pointer;
  color: #ffffff;
}

.suggestion-item:hover {
  background: #555555;
}
</style>
