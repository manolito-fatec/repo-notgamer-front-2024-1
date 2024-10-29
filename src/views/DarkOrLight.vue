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

.toggle-label {
  cursor: pointer;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center; 
  width: 35px;
  height: 35px;
}

.sun, .moon {
  text-align: center;
  position: absolute;
  font-size: 35px;
  transition: 0.3s;
}

.sun {
  opacity: 0;
  color: white;
}

.moon {
  opacity: 1;
  color: black;
}

input[type="checkbox"]:checked + .toggle-label .sun {
  opacity: 1;
}

input[type="checkbox"]:checked + .toggle-label .moon {
  opacity: 0;
}

</style>