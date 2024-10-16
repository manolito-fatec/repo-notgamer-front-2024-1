<template>
  <button class="start-button">
    <IconCorrect class="icon"/>
    <span class="button-text">Iniciar</span>
  </button>
</template>

<script setup>
import IconCorrect from "@/components/icons/IconCorrect.vue";
</script>

<style scoped>
.start-button {
  height: 30px;
  display: flex;
  align-items: center;
  background-color: #929292;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button .icon {
  margin-right: 16px;
  width: 18px;
  height: 18px;
}

.start-button .button-text {
  font-size: 11px;
  font-weight: bold;
  color: #262626;
}

</style>
