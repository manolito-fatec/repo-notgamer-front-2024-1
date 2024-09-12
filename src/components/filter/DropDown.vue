<template>
  <div class="filter-item">
    <label :for="id" class="filter-label">{{ label }}</label>
    <select
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="filter-input"
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
  margin-bottom: 16px;
}

.filter-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #000;
}

.filter-input {
  width: 50%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #000;
}
</style>
