<template>
  <button class="clear-button">
    <IconBlock class="icon"/>
    <span class="button-text">Limpar</span>
  </button>
</template>

<script setup>
import IconBlock from "@/components/icons/IconBlock.vue";
</script>

<style scoped>
.clear-button {
  height: 30px;
  display: flex;
  align-items: center;
  background-color: #929292;
  color: #262626;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-button .icon {
  margin-right: 16px;
  width: 18px;
  height: 18px;
}

.clear-button .button-text {
  font-size: 11px;
  font-weight: bold;
  color: #262626;
}
</style>
