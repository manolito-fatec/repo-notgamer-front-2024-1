<template>
  <div class="sidebar">
    <button id="toggle-btn" class="toggle-btn" @click="onToggleFilters" @toggle-dark-white-mode="darkMode">
      <IconFilter />
    </button>
    <button class="int-btn" @click="onToggleZone">
      <IconAlert />
    </button>
  </div>
</template>

<script setup>
import { getClick } from '@/components/stores/StoreGetClick.js'
import IconFilter from "@/components/icons/IconFilter.vue";
import IconAlert from './icons/IconAlert.vue';

const storeFilters = getClick();

const emit = defineEmits(['toggle-filters', 'toggle-zone']);
const props = defineProps({
  showFilters: Boolean,
  showZone: Boolean
});

function onToggleFilters() {
  storeFilters.onClickToggleFilters();
  emit('toggle-filters')
}

function onToggleZone() {
  emit('toggle-zone');
}
</script>

<style scoped>
.sidebar {
  display: grid;
  grid-template-rows: repeat(auto, 100%);
}

.toggle-btn, .int-btn {
  background-color: transparent;
  padding: 0;
  border-color: transparent;
}

.int-btn:hover, .toggle-btn:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease-in-out;
}
</style>
