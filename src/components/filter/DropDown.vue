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
</style>
