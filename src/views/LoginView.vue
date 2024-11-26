<template>
  <div class="container">
    <div class="central">
        <img class="logo" :src="Logo"/>
        <div class="login">
          <div for="email">Email:</div>
          <input
            class="text-box"
            type="email"
            id="email"
            v-model="emailUser"
            placeholder="Digite seu email"
            required
          />
        </div>
        <div class="login">
          <div for="password">Senha:</div>
          <input
            class="text-box"
            type="password"
            id="password"
            v-model="passwordUser"
            placeholder="Digite sua senha"
            required
          />
        </div>
      <div class="login">
        <button class="login_btn" type="submit" @click="loginValidate">Entrar</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {login} from "@/services/apiService.ts";
import Logo from "@/assets/Logo.png";
import { ref } from "vue";

const emailUser = ref<String>("");
const passwordUser = ref<String>("");


const loginValidate = () => {
  console.log(emailUser.value, passwordUser.value)
  const valor = login(emailUser.value, passwordUser.value);
}



</script>
<style>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../assets/MapaBackground.png");
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(15px);
  z-index: 0;
}

.central {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350px;
  transform: translate(-50%, -50%);
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 100%;
  height: 10%;
}
.login_btn {
  padding: 0.5em 1em;
  background-color: #000059;
  color: white;
  width: 100%;
  height: 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.text-box {
  width: 100%;
  height: 30px;
  border: none;
  border-radius: 10px;
  padding: 0.5em 1em;
}
.login{
  padding: 0.5em 1em;
  font-family: 'Poppins', regular, sans-serif;
  font-size: 12px;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
