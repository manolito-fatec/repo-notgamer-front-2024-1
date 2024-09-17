<template>
  <button class="start-button">
    <IconCorrect class="icon" />
    <span class="button-text">Iniciar</span>
  </button>
</template>

<script setup>
import IconCorrect from "@/components/icons/IconCorrect.vue";
</script>

<style scoped>
.start-button {
  display: flex;
  align-items: center;
  background-color: #929292;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button .icon {
  margin-right: 8px;
  width: 24px;
  height: 24px;
}

.start-button .button-text {
  font-size: 16px;
  color: #ffffff;
}

</style>
