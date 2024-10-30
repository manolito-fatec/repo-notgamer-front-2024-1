<template>
  <div class="dark-white-mode">
    <input type="checkbox" id="toggle" @click="$emit('toggleDarkLightMode')"/>
    <label for="toggle" class="toggle-label">
      <i class="fas fa-moon moon"></i>
      <i class="fas fa-sun sun"></i>
    </label>
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  display: none;
}

.dark-white-mode {
  position: absolute;
  right: 10px;
  z-index: 5;
}

.toggle-label {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 21px;
  height: 21px;
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.sun, .moon {
  text-align: center;
  position: absolute;
  font-size: 15px;
  transition: 0.3s;
  color: #3A3A3A;
}

.sun {
  opacity: 0;
}

.moon {
  opacity: 1;
}

input[type="checkbox"]:checked + .toggle-label .sun {
  opacity: 1;
}

input[type="checkbox"]:checked + .toggle-label .moon {
  opacity: 0;
}
</style>
