<template>
    <div class="forms_background">
        <img :src="Logo"/>
        <div class="forms_fields">
            <label> Nome: </label>
            <input type="text" id="nome" v-model="name" class="input" required>

            <label> E-mail: </label>
            <input type="email" id="email" v-model="email" class="input" required>

            <label> Senha: </label>
            <input type="password" id="senha" v-model="password" class="input" required>

            <label> Confirme sua senha: </label>
            <input type="password" id="confirmar_senha" v-model="confirmPassword" class="input" required>
        </div>
        <div class="group_btns">
          <div class="admin_btn">
            <input type="radio" value="Admin" v-model="option">
            <label>Administrador</label>
          </div>

          <div class="common_btn">
            <input type="radio" value="Comum" v-model="option">
            <label>Comum</label>
          </div>
        </div>
        <div class="submit_group">
          <button type="submit" class="back_btn" > < </button>

          <button type="submit" class="submit_btn" @click="submitUser"> CADASTRAR </button>
        </div>
    </div>
</template>
  
<script setup>

import { ref } from 'vue';
import Logo from "@/assets/Logo.png";
import { useToast } from "vue-toastification";
import { registerUser } from "@/services/apiService.ts";

const toast = useToast();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("")
const option = ref("");

async function submitUser() {
  let hasErrors = false;

  if (!name.value) {
    toast.error("Por favor, coloque um nome.");
    hasErrors = true;
  }
  if (!email.value) {
    toast.error("Por favor, coloque um email.");
    hasErrors = true;
  }
  if (!password.value) {
    toast.error("Por favor, coloque uma senha.");
    hasErrors = true;
  }
  if (!confirmPassword.value) {
    toast.error("Por favor, confirme essa senha.");
    hasErrors = true;
  }
  if (!option.value) {
    toast.error("Por favor, selecione o nível de acesso.");
    hasErrors = true;
  }

  else if (password.value != confirmPassword.value) {
    toast.error("As senhas não conferem.");
    hasErrors = true;
  }

  else if (!hasErrors) {
    const response = await registerUser(email.value, 
                                        password.value,
                                        option.value
                                        )
  }
}

</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
.logo {
  width: 37em;
  height: 10.43em;
}

.forms_background {
  width: 39.25em;
  height: 42em;
  padding: 2em;
  display: flex;
  flex-direction: column; 
  background: black;
  opacity: 60%;
  border-radius: 20px;
  box-shadow: 3px 0 0 #000059;
}

.forms_fields {
  font-family: 'Poppins';
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  color: white;
}

.input {
  border-radius: 10px;
}

.admin_btn, 
.common_btn {
  display: flex;
  gap: 0.5em;
}

.back_btn,
.submit_btn {
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins';
  font-size: 15px;
  font-weight: bold;
  color: white;
  background-color: #000059;
  border: none;
  height: 36px;
  min-width: 36px;
  cursor: pointer;
}

.submit_btn {
  width: 34em;
  height: 2.6em;
}

.back_btn {
  width: 4.5em;
  height: 2.6em;
}

.group_btns {
  display: flex;
  font-weight: bold;
  font-family: 'Poppins';
  color: white;
  justify-content: left; 
  align-items: center;
  gap: 8em;
  margin-top: 1em;
}

.submit_group {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
 
input[type="radio"] {
  accent-color: #000059;
}

</style>

  