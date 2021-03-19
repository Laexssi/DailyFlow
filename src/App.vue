<template>
  <v-app class="main-screen__container">
    <div v-if="!loading" class="main-screen" id="app">
      <TheHeader/>

      <router-view/>

      <Navigation/>
    </div>

    <div
    v-else
    class="main-screen__loader-container">
      <v-progress-circular
      indeterminate
      color="primary"/>
    </div>
  </v-app>
</template>

<script>
  import TheHeader from 'components/TheHeader';
  import Navigation from 'components/Navigation';

  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import { auth } from 'firebaseDir';

  export default {
    name: 'App',
    components: {
      TheHeader,
      Navigation,
    },
    async created() {
      auth.onAuthStateChanged((user) => {
        this.setIsLogged(false);
        this.setIsInited(true);
        if (this.$router.currentRoute.name === 'login') {
          this.loading = false;
          return;
        }

        if (!user) {
          this.loading = false;
          this.$router.push({ name: 'login' });
          return;
        }

        this.setUser({ ...user, isNewUser: false });
        this.setIsLogged(true);
        this.loading = false;
      });
    },
    methods: {
      ...mapActions({ loginWithGoogle: 'auth/login' }),
      ...mapMutations({ setUser: 'auth/setUser', setIsLogged: 'auth/setIsLogged', setIsInited: 'auth/setIsInited' }),
    },
    computed: {
      ...mapGetters({ getUser: 'auth/getUser', isLogged: 'auth/getIsLogged' }),
    },
    data: () => ({
      loading: true,
    }),
  };
</script>

<style lang="scss">
  .main-screen__container {
    min-width: 320px !important;
    overflow-x: auto;
  }
</style>
