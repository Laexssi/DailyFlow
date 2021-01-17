<template>
  <div
  v-if="showHeader"
  class="main-header">
    <div class="main-header__content">
      <div class="main_header__controls">
        <v-btn
        icon
        @click="logoutHandler">
          <v-icon color="black">
            mdi-exit-to-app
          </v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'TheHeader',
    methods: {
      ...mapActions({ logout: 'auth/logout' }),
      logoutHandler() {
        this.logout();
      },
    },
    computed: {
      showHeader() {
        return this.$route.name !== 'login';
      },
    },
    data: () => ({}),
  };
</script>

<style lang="scss">
  .main-header {
    display: flex;
    flex-flow: column nowrap;
    flex-shrink: 0;

    position: sticky;
    top: 0;
    right: 0;
    left: 0;

    background-color: $background-color;
    z-index: 6;
  }

  .main-header__content {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    flex-shrink: 0;
    width: 100%;

    height: $header-height;
    box-sizing: border-box;
    padding: 0 12px;

    @include between-children() {
      margin-right: 12px;
    }
  }

  .main_header__controls {
    margin-left: auto;
  }
</style>
