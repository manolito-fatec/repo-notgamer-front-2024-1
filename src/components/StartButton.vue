<template>
  <button class="start-button" id="start-button">
    <div class="button-content">
      <span class="button-text">Iniciar</span>
    </div>
  </button>
</template>

<script setup>
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'
import { getClick } from '@/components/stores/StoreGetClick.js'
import { watch } from 'vue'

const store = darkModeClick();
const storeFilters = getClick();


watch(() => store.onClickDarkMode,
  () => {
  const button = document.getElementById('start-button')

  if (store.onClickDarkMode) {
    button.style.background = "#EC1C24"

  } else {
    button.style.background = "#000059"
    
  }
});

</script>

<style scoped>
.start-button {
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000059;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-button .button-text {
  font-size: 18px;
  font-weight: 550;
  color: #FFF;
}
</style>
