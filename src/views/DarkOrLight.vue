<template>
  <div class="dark-white-mode">
    <input type="checkbox" id="toggle" @click="onToggleDarkMode"/>
    <label for="toggle" class="toggle-label">
      <i class="fas fa-moon moon"></i>
      <i class="fas fa-sun sun"></i>
    </label>
  </div>
</template>

<script setup>
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'

const store = darkModeClick();

const emit = defineEmits(['toggle-dark-white-mode']);

function onToggleDarkMode() {
  store.onClickToggleDarkMode();
  emit('toggle-dark-white-mode');
}
 
</script>

<style scoped>
input[type="checkbox"] {
  display: none;
}

.dark-white-mode {
  position: absolute;
  right: 10px;
  z-index: 5;
}

.toggle-label {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: white;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.sun, .moon {
  text-align: center;
  position: absolute;
  font-size: 20px;
  transition: 0.3s;
  color: #3A3A3A;
}

.sun {
  opacity: 0;
}

.moon {
  opacity: 1;
}

input[type="checkbox"]:checked + .toggle-label .sun {
  opacity: 1;
}

input[type="checkbox"]:checked + .toggle-label .moon {
  opacity: 0;
}
</style>
