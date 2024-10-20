<script lang="ts">
</script>
<template>
<div class="loading-state">
  <div class="loading"></div>
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
  border-top-color: #EC1C24;
  animation: loading 1s linear infinite;
}
@keyframes loading {
  to {
    transform: rotate(360deg);
  }
}

</style>