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
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #929292;
  color: #262626;
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

.clear-button .icon {
  width:15px;
  height: 15px;
  margin-right: 3px;
}

.clear-button .button-text {
  font-size: 14px;
  font-weight: 550;
  color: #262626;
}
</style>
