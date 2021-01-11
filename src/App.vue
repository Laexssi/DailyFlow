<template>
  <div class="main-screen" id="app">
    <v-app>
      <TheHeader/>
      <router-view/>
    </v-app>
  </div>
</template>

<script>
  import TheHeader from 'components/TheHeader';

  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import { auth } from 'firebaseDir';

  export default {
    name: 'App',
    components: {
      TheHeader,
    },
    async created() {
      const setStoreUser = this.setUser.bind(this);
      const setStoreIsLogged = this.setIsLogged.bind(this);
      auth.onAuthStateChanged((user) => {
        if (!user) {
          setStoreIsLogged(false);
          this.$router.push({ name: 'login' });
          return;
        }
        setStoreUser({ ...user, isNewUser: false });
        setStoreIsLogged(true);
      });
    },
    methods: {
      ...mapActions({ loginWithGoogle: 'auth/login' }),
      ...mapMutations({ setUser: 'auth/setUser', setIsLogged: 'auth/setIsLogged' }),
    },
    computed: {
      ...mapGetters({ getUser: 'auth/getUser' }),
      isLogged() {
        return !!this.getUser;
      },
    },
  };
</script>

<style lang="scss">
</style>
