<template>
  <div class="history-wrapper">
    <h2 class="history-title">Histórico</h2>
    <div class="history-container">
      <textarea v-model="historyText" readonly></textarea>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const historyText = ref('')
</script>

<style scoped>
.history-wrapper {
  margin-top: 16px;
}

.history-title {
  color: #ffffff;
  margin-bottom: 8px;
  font-size: 16px;
  font-family: Arial, sans-serif;
}

.history-container {
  padding: 0;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #333333;
  display: flex;
  height: 400px;
}

.history-container textarea {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: #ffffff;
  padding: 16px;
  font-size: 16px;
  font-family: Arial, sans-serif;
  resize: none;
  box-sizing: border-box;
  cursor: default;
}
</style>
