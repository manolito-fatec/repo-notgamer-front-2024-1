<template>
  <div class="date-range-container">
    <div class="date-range">
      <input
          type="date"
          v-model="startDate"
          @change="validateStartDate"
          :max="maxStartDate"
          class="filter-input date-input"
      />
      <span class="date-range-separator"></span>
      <input
          type="date"
          v-model="endDate"
          @change="validateEndDate"
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

const maxStartDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const minEndDate = computed(() => {
  if (!startDate.value) return null
  return startDate.value
})

const maxEndDate = computed(() => {
  if (!startDate.value) return null
  const start = new Date(startDate.value)
  const maxEnd = new Date(start)
  maxEnd.setDate(start.getDate() + 31)
  return maxEnd.toISOString().split('T')[0]
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

function validateStartDate() {
  if (startDate.value && endDate.value && new Date(startDate.value) > new Date(endDate.value)) {
    endDate.value = startDate.value
  }
}

function validateEndDate() {
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

.date-range {
  display: flex;
  align-items: center;
}

.date-input {
  width: calc(50% - 8px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #444444;
  color: #fff;
}

.date-range-separator {
  margin: 0 8px;
  color: #000;
}
</style>
