<template>
  <Dropdown
      :options="options"
      v-model="selected"
      @change="$emit('change', selected)"
      placeholder="Selecione o tipo"
      class="dropdown-component"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import Dropdown from 'primevue/dropdown';

export default defineComponent({
  name: 'DropdownComponent',
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
.dropdown-component {
  width: 100%;
  background-color: #5F1E5C;
  border: 1px solid #4C144A;
  border-radius: 4px;
  padding: 0.5rem;
  color: #FFFFFF;
}
</style>
