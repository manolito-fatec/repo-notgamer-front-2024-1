<template>
  <DatePicker
      v-model="selectedDates"
      selectionMode="range"
      @change="$emit('change', selectedDates)"
      dateFormat="dd/mm/yy"
      placeholder="Selecione o intervalo de datas"
      class="date-range-picker"
      showButtonBar
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DatePicker from 'primevue/datepicker';

export default defineComponent({
  name: 'DateRangePickerComponent',
  components: {
    DatePicker,
  },
  emits: ['change'],
  setup(_, { emit }) {
    const selectedDates = ref<Date[] | null>(null);

    return {
      selectedDates,
    };
  },
});
</script>

<style scoped>
.date-range-picker {
  width: 100%;
  background-color: #5F1E5C;
  border: 1px solid #4C144A;
  border-radius: 4px;
  padding: 0.5rem;
  color: #FFFFFF;
}
</style>
