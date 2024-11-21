<template>
    <div class="container_form">
        <img :src="Logo"/>
        <div class="form_grupo">
            <label for="nome" class="form_label">Nome</label>
            <input type="text" name="nome" class="form_input" id="nome" placeholder="Nome" required>

            <label for="e-mail" class="form_label">Email</label>
            <input type="email" name="email" class="form_input" id="email" placeholder="seuemail@email.com" required>

            <label for="datanascimento" class="form_label">Data de Nascimento</label>
            <input type="password" name="datanascimento" class="form_input" id="datanascimento" placeholder="Informe sua senha" required>
        </div>
        <div class="radio-btn">
            <input type="radio" class="form_new_input" value="Admin" required="required">
            <label for="masculino" class="radio_label"> <span class="radio_new_btn"></span> Admin </label>

            <input type="radio" class="form_new_input" value="Comum" required="required">
            <label for="feminino" class="radio_label"> <span class="radio_new_btn"></span> Comum </label>
        </div>
        <div class="submit">
          <input type="hidden" value="<">
          <button type="submit" class="back" > < </button>

          <input type="hidden" value="cadastrar">
          <button type="submit" class="submit_btn"> Cadastrar </button>
        </div>
    </div>
</template>
  
<script setup>

import Logo from "@/assets/Logo.png";

</script>
  
<style scoped>
.logo {
  width: 10em;
  height: 10em;
}

.container_form {
  width: 40em;
  padding: 2em;
  display: flex;
  flex-direction: column; 
  background: black;
  opacity: 60%;
  border-radius: 20px;
  box-shadow: 0 2px 4px #000059;
}

.form_grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  color: white;
}

.radio-btn {
  display: flex;
  color: white;
  gap: 0.5em;
}

.submit {
  margin-top: 1em;
  align-self: flex-start;
  color: black;
  gap: 0.5em;
}

.submit_btn, .back {
  padding: 0.5em 1em;
  background-color: #000059;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}




</style>

  