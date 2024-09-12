<template>
  <div class="date-range-container">
    <label class="date-range-label">Data</label>
    <div class="date-range">
      <input
          type="date"
          v-model="startDate"
          @change="updateEndDate"
          class="filter-input date-input"
      />
      <span class="date-range-separator">até</span>
      <input
          type="date"
          v-model="endDate"
          :min="minEndDate"
          :max="maxEndDate"
          class="filter-input date-input"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const startDate = ref(null)
const endDate = ref(null)

const minEndDate = computed(() => {
  if (!startDate.value) return null
  const start = new Date(startDate.value)
  start.setDate(start.getDate())
  return start.toISOString().split('T')[0]
})

const maxEndDate = computed(() => {
  if (!startDate.value) return null
  const start = new Date(startDate.value)
  start.setDate(start.getDate() + 31)
  return start.toISOString().split('T')[0]
})

watch([startDate, endDate], ([newStartDate, newEndDate]) => {
  if (newStartDate && newEndDate) {
    const start = new Date(newStartDate)
    const end = new Date(newEndDate)
    const maxEnd = new Date(start)
    maxEnd.setDate(start.getDate() + 31)
    if (end > maxEnd) {
      endDate.value = maxEnd.toISOString().split('T')[0]
    }
  }
})

function updateEndDate() {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const maxEnd = new Date(start)
    maxEnd.setDate(start.getDate() + 31)
    if (end > maxEnd) {
      endDate.value = maxEnd.toISOString().split('T')[0]
    }
  }
}
</script>

<style scoped>
.date-range-container {
  margin-bottom: 16px;
}

.date-range-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #000;
}

.date-range {
  display: flex;
  align-items: center;
}

.date-input {
  width: calc(50% - 8px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #000;
}

.date-range-separator {
  margin: 0 8px;
  font-weight: bold;
  color: #000;
}
</style>
