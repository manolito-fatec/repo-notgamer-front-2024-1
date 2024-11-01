<template>
  <div class="sidebar">
    <IconLogo />
    <button class="toggle-btn" @click="onToggleFilters">
      <IconFilter />
    </button>
    <button class="toggle-zone" @click="onToggleZone">
      Blablabla
    </button>
  </div>
</template>

<script setup>
import { getClick } from '@/components/stores/StoreGetClick.js'
import IconFilter from "@/components/icons/IconFilter.vue";
import IconLogo from "@/components/icons/IconLogo.vue";
import {ref} from 'vue';

const store = getClick();

const emit = defineEmits(['toggle-filters']);

function onToggleFilters() {
  store.onClickToggleFilters();
  emit('toggle-filters')
}

function onToggleZone() {
  emit('toggle-zone');

}

</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: -5%;
  width: 100px;
  height: 110%;
  background: linear-gradient(180deg, #262626 0%, #3A3A3A 50%, #262626 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 18px;
  z-index: 10;
}

.sidebar > * {
  margin: 46px 0;
  z-index: 10;
}

.toggle-btn {
  background-color: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
</style>
