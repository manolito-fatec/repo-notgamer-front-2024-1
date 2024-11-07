<script lang="ts" setup>
import {getClick} from '@/components/stores/StoreGetClick.js'
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js'
import { watch } from 'vue';

const store = darkModeClick();
const storeFilters = getClick();

watch(() => store.onClickDarkMode && storeFilters.onClickFilters,
  () => {
  const loading = document.getElementById('loading')

  if (store.onClickDarkMode && storeFilters.onClickFilters){
    loading.style.borderTopColor = "#EC1C24";
  } else {
    loading.style.borderTopColor = "#000059";
  }
});

</script>
<template>
<div class="loading-state">
  <div class="loading" id="loading"></div>
</div>
</template>
<style lang="css" scoped>
.loading-state {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-top-color: #000059;
  animation: loading 1s linear infinite;
}
@keyframes loading {
  to {
    transform: rotate(360deg);
  }
}

</style>