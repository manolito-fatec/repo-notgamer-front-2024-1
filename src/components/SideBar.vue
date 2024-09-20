<template>
  <div class="sidebar">
    <IconLogo />
    <button class="toggle-btn" @click="$emit('toggle-filters')">
      <IconFilter />
    </button>
  </div>
</template>

<script setup>
import IconFilter from "@/components/icons/IconFilter.vue";
import IconLogo from "@/components/icons/IconLogo.vue";
import IconAlert from "@/components/icons/IconAlert.vue";
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: -5%;
  width: 75px;
  height: 110%;
  background: linear-gradient(180deg, #262626 0%, #3A3A3A 50%, #262626 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 8px;
}

.sidebar > * {
  margin: 36px 0;
}

.toggle-btn {
  background-color: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
