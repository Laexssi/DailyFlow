<template>
  <div class="main-screen--content form-container">
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
</style>
