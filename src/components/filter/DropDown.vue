<template>
  <div class="filter-item">
    <label :for="id" class="filter-label">{{ label }}</label>
    <select
        :id="id"
        :value="modelValue"
        class="filter-input"
        @input="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: Array
})


</script>

<style scoped>
.filter-item {
  margin-bottom: 8px;
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

.filter-input:hover {
  background-color: #555555;
}

button {
  padding: 10px 16px;
  background-color: #666666;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #888888;
}

button:active {
  background-color: #444444;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(136, 136, 136, 0.5);
}
</style>
