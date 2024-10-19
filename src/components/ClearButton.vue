<template>
  <button class="clear-button">
    <div class="clear-content">
      <IconBlock class="icon"/>
      <span class="button-text">Limpar</span>
    </div>
  </button>
</template>

<script setup>
import IconBlock from "@/components/icons/IconBlock.vue";
</script>

<style scoped>
.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #929292;
  color: #262626;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button .icon {
  margin-right: 3px;
}

.clear-button .button-text {
  font-size: 16px;
  color: #262626;
}
</style>
