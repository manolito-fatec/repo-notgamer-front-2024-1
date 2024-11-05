<template>
  <div class="custom-checkbox" @click="toggle">
    <div class="checkbox" :class="{ checked }">
      <span v-if="checked" class="checkmark"></span>
    </div>
    <label>{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  label: string;
}>();

const emit = defineEmits(['update:modelValue']);

const checked = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newValue) => {
      checked.value = newValue;
    }
);

const toggle = () => {
  checked.value = !checked.value;
  emit('update:modelValue', checked.value);
};
</script>

<style scoped>
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  width: 20px;
  height: 20px;
  background-color: #444444;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: background-color 0.3s;
}

.checkbox.checked {
  background-color: #EC1C24;
}

.checkmark {
  color: white;
}

label {
  color: white;
}
</style>