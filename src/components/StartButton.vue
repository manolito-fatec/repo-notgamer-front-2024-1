<template>
  <button class="start-button">
    <div class="button-content">
      <IconCorrect class="icon" />
      <span class="button-text">Iniciar</span>
    </div>
  </button>
</template>

<script setup>
import IconCorrect from "@/components/icons/IconCorrect.vue";
</script>

<style scoped>
.start-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #929292;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-button .icon {
  width: 24px;
  height: 24px;
  margin-right: 3px;
}

.start-button .button-text {
  font-size: 16px;
  color: #262626;
}
</style>
