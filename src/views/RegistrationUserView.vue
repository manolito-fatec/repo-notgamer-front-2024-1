<template>
  <div class="mapWrapper">
    <div class="formsBackground" id="formsBackground">
        <img :src="Logo"/>
        <div class="formsFields">
            <label> E-mail: </label>
            <input type="email" id="email" v-model="email" class="input" required>
            <p v-show="errorEmail" style="color:red;margin: 0;padding: 0;">{{ "Por favor, coloque um e-mail válido." }}</p>

            <label> Senha: </label>
            <input type="password" id="senha" v-model="password" class="input" required>
            <p v-show="errorPassword" style="color:red;margin: 0;padding: 0;">{{ "Por favor, coloque uma senha." }}</p>

            <label> Confirme sua senha: </label>
            <input type="password" id="confirmar_senha" v-model="confirmPassword" class="input" required>
            <p v-show="errorConfirmPassword" style="color:red;margin: 0;padding: 0;">{{ "Por favor, confirme a senha." }}</p>
        </div>
        <div class="groupBtns">
          <div class="adminBtn">
            <input type="radio" value="ADMIN" v-model="option">
            <label>Administrador</label>
          </div>

          <div class="commonBtn">
            <input type="radio" value="USER" v-model="option">
            <label>Comum</label>
          </div>

          <p v-show="errorOption" style="color:red;margin: 0;padding: 0;">{{ "Por favor, selecione o nível de acesso." }}</p>

        </div>
        <div class="submitGroup">
          <button type="submit" class="backBtn" id="backBtn" @click="returnHome"> < </button>

          <button type="submit" class="submitBtn" id="submitBtn" @click="submitUser"> CADASTRAR </button>
        </div>
    </div>
  </div>
</template>
  
<script setup>
import router from '@/router'
import { ref, watch } from 'vue';
import Logo from "@/assets/Logo.png";
import { useToast } from "vue-toastification";
import { darkModeClick } from '@/components/stores/StoreDarkModeGetClick.js';
import { verifyIfHaveTwoEmails, registerUser } from "@/services/apiService.ts";

const toast = useToast();
const email = ref("");
const password = ref("");
const confirmPassword = ref("")
const option = ref("");
const errorEmail = ref(false);
const errorPassword = ref(false);
const errorConfirmPassword = ref(false);
const errorOption = ref(false);
const store = darkModeClick();

async function returnHome() {
  router.replace("/home");
}

async function submitUser() {
  const response = await verifyIfHaveTwoEmails(email.value);
  
  errorEmail.value = false;
  errorPassword.value = false;
  errorConfirmPassword.value = false;
  errorOption.value = false;

  if (!email.value) {
    errorEmail.value = true;
  }
  if (!password.value) {
    errorPassword.value = true;
  }
  if (!confirmPassword.value) {
    errorConfirmPassword.value = true;
  }
  if (!option.value) {
    errorOption.value = true;
  }

  else if (!(email.value.match("@"))) {
    toast.error("Coloque um e-mail válido!")
  }

  else if (password.value != confirmPassword.value) {
    toast.error("As senhas não conferem.");
  }

  else if (response.emailExist) {
    toast.error("O usuário já está cadastrado.");
  }

  else {
    await registerUser(email.value, 
                      password.value,
                      option.value
                      )
    toast.success("Usuário Cadastrado!");

    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    option.value = "";
  }
}

</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.mapWrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.mapWrapper::before {
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

.logo {
  width: 37em;
  height: 10.43em;
}

.formsBackground {
  position: absolute;
  width: 480px;
  top: 50%;
  left: 50%;
  padding: 2em;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column; 
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  box-shadow: 3px 0 0 #000059;
}

.formsFields {
  font-family: 'Poppins';
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  color: white;
}

.input {
  border-radius: 10px;
}

.adminBtn, 
.commonBtn {
  display: flex;
  gap: 0.5em;
}

.backBtn,
.submitBtn {
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

.submitBtn {
  width: 34em;
  height: 2.6em;
}

.backBtn {
  width: 4.5em;
  height: 2.6em;
}

.groupBtns {
  display: flex;
  font-weight: bold;
  font-family: 'Poppins';
  color: white;
  justify-content: left; 
  align-items: center;
  gap: 1em;
  margin-top: 1em;
}

.submitGroup {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
 
input[type="radio"] {
  accent-color: #000059;
}

</style>

  