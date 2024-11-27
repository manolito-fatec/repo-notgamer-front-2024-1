<template>
  <div class="custom-checkbox" @click="toggle">
    <div class="checkbox" :class="{ checked }" :style="checkboxStyle">
      <span v-if="checked" class="checkmark"></span>
    </div>
    <label :style="labelStyle">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, computed } from 'vue';
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';

const store = darkModeClick();

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

const checkboxStyle = computed(() => {
  if (store.onClickDarkMode) {
    return {
      backgroundColor: checked.value ? '#EC1C24' : '#444444',
    };
  }
  return {
    backgroundColor: checked.value ? '#000059' : '#6D6D6D',
  };
});

const labelStyle = computed(() => ({
  color: store.onClickDarkMode ? '#FFF' : '#000',
}));

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
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: background-color 0.3s;
}

.checkmark {
  color: white;
}

label {
  font-size: 15px;
}
</style>