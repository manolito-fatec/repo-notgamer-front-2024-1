<template>
  <button class="clear-button" id="clear-button">
    <div class="clear-content">
      <span class="button-text">Limpar</span>
    </div>
  </button>
</template>

<script setup>
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'
import { getClick } from '@/components/stores/StoreGetClick.js'
import { watch } from 'vue'

const store = darkModeClick();
const storeFilters = getClick();


watch(() => store.onClickDarkMode && storeFilters.onClickFilters,
  () => {
  const button = document.getElementById('clear-button')

  if (store.onClickDarkMode && storeFilters.onClickFilters) {
    button.style.background = "#EC1C24"

  } else {
    button.style.background = "#000059"
    
  }
});

</script>

<style scoped>
.clear-button {
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000059;
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button .button-text {
  font-size: 14px;
  font-weight: 550;
  color: #FFF;
}
</style>
