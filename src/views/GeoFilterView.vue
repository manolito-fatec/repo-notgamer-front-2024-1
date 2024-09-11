<template>
  <div>
    <div class="geo-filter">
      <DateRangePickerComponent
          :value="dateRange"
          @change="onDateRangeChange"
      />
      <DropdownComponent
          :options="typeOptions"
          @change="onTypeChange"
      />
      <SourceFilterComponent
          :options="sourceOptions"
          @change="onSourceChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DateRangePickerComponent from "@/components/filter/DateRangePickerComponent.vue";
import DropdownComponent from "@/components/filter/DropdownComponent.vue";
import SourceFilterComponent from "@/components/filter/SourceFilterComponent.vue";

export default defineComponent({
  name: 'GeoFilter',
  components: {
    DateRangePickerComponent,
    DropdownComponent,
    SourceFilterComponent,
  },
  setup() {
    const dateRange = ref<Date[] | null>(null);
    const typeOptions = ref<string[]>(['Pessoa', 'Veículo']);
    const sourceOptions = ref<string[]>(['Wearables', 'Smartphone', 'Tags']);

    const onDateRangeChange = (newDateRange: Date[] | null) => {
      dateRange.value = newDateRange;
    };

    const onTypeChange = (newType: string | null) => {};

    const onSourceChange = (newSource: string | null) => {};

    return {
      dateRange,
      typeOptions,
      sourceOptions,
      onDateRangeChange,
      onTypeChange,
      onSourceChange,
    };
  },
});
</script>

<style scoped>
.geo-filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 400px;
  position: absolute;
  left: 0;
  padding: 1rem;
  background-color: #71276F;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.geo-filter h1 {
  color: #FFFFFF;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.geo-filter input, .geo-filter select {
  color: #FFFFFF;
}
</style>
