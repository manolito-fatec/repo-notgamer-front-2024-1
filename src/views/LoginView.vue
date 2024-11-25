<template>
  <div class="temp">
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Digite seu email"
          required
        />
      </div>
      <div>
        <label for="password">Senha:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Digite sua senha"
          required
        />
      </div>
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      console.log("Email:", this.email);
      console.log("Senha:", this.password);
    },
  },
};
</script>
<style>

.temp {
  display: flex;
  background-image: url(../assets/MapaBackground.png);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh
}

</style>
