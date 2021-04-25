<template>
  <div class="main-screen--content form-container">
    <h1 class="login-header">
      Daily Flow
    </h1>

    <div class="login__info">
      <p class="login__info-text">
        Создавайте карточки занятий, которые сохранятся в вашу библиотеку.
      </p>

      <p class="login__info-text">
        Добавляйте лейблы вашим занятием.
      </p>

      <p class="login__info-text">
        Составляйте переиспользуемые планы с настройками продолжительности.
      </p>

      <p class="login__info-text">
        Отмечайте выполнения занятий и следите за своей статистикой.
      </p>
    </div>

    <p>
      Login with Google
    </p>

    <v-btn
    class="mx-2"
    fab
    large
    @click="loginWithGoogleHandler">
      <v-icon color="red">
        mdi-google
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'Login',
    methods: {
      ...mapActions({ loginWithGoogle: 'auth/login' }),
      async loginWithGoogleHandler() {
        this.loader = true;
        try {
          await this.loginWithGoogle();
          await this.$router.push({ name: 'library' });
        } finally {
          this.loader = false;
        }
      },
    },
    data: () => ({
      loader: false,
    }),
  };
</script>

<style lang="scss">
  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .login-header {
    font-size: 20px;
    text-align: center;
  }

  .login__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
    @include between-children() {
      margin-bottom: 8px;
    }
  }

  .login__info-text {
  }
</style>
