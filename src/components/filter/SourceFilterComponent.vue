<template>
  <Dropdown
      :options="options"
      v-model="selected"
      @change="$emit('change', selected)"
      placeholder="Selecione a origem dos dados"
      class="source-filter-component"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import Dropdown from "primevue/dropdown";

export default defineComponent({
  name: 'SourceFilterComponent',
  components: {
    Dropdown,
  },
  props: {
    options: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const selected = ref<string | null>(null);

    return {
      selected,
    };
  },
});
</script>

<style scoped>
.source-filter-component {
  width: 100%;
  background-color: #5F1E5C;
  border: 1px solid #4C144A;
  border-radius: 4px;
  padding: 0.5rem;
  color: #FFFFFF;
}
</style>
