<template>
  <div
  v-if="showHeader"
  class="main-header">
    <div class="main-header__content">
      <div class="main-header__navigation">
        <v-btn
        v-if="showRouterBackButton"
        icon
        large
        class="mr-2"
        @click="routerBackHandler">
          <v-icon>
            mdi-arrow-left
          </v-icon>
        </v-btn>

        <div
        v-if="!showSearchInput"
        class="main-header__navigation-name">
          {{ getRouteNameText() }}
        </div>
      </div>

      <v-text-field
      v-if="showSearchInput"
      v-model="searchQueryValue"
      placeholder="Search"
      dense
      hideDetails
      appendIcon="mdi-magnify"/>

      <div class="main_header__controls">
        <v-btn
        v-if="showSearchButton && !showSearchInput"
        icon
        @click="showSearchInput = true">
          <v-icon color="black">
            mdi-magnify
          </v-icon>
        </v-btn>

        <v-btn
        v-if="showSearchButton && showSearchInput"
        icon
        @click="closeSearchHandler">
          <v-icon color="black">
            mdi-close
          </v-icon>
        </v-btn>

        <v-avatar
        v-if="user"
        size="32">
          <img
          :src="user.photoURL"
          :alt="user.displayName">
        </v-avatar>

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
  import { mapActions, mapMutations, mapState } from 'vuex';
  import capitalizeFirstLetter from 'helpers/capitalizeFirstLetter';
  import debounce from 'lodash/debounce';

  export default {
    name: 'TheHeader',
    methods: {
      ...mapActions({ logout: 'auth/logout' }),
      ...mapMutations({ setSearchQuery: 'appState/setSearchQuery' }),
      logoutHandler() {
        this.logout();
      },
      routerBackHandler() {
        this.$router.go(-1);
      },
      getRouteNameText() {
        return {
          'activity-editor-new': 'New activity',
          'activity-editor-edit': 'Edit activity',
          'plan-editor-new': 'New plan',
          'plan-editor-edit': 'Edit plan',
        }[this.$route.name] || capitalizeFirstLetter(this.$route.name);
      },
      closeSearchHandler() {
        this.setSearchQuery('');
        this.showSearchInput = false;
      },
    },
    computed: {
      ...mapState('appState', ['showRouterBackButton', 'showSearchButton', 'searchQuery']),
      ...mapState('auth', ['user']),
      showHeader() {
        const routesWithoutHeader = ['login', 'plan'];
        return !routesWithoutHeader.includes(this.$route.name);
      },
      searchQueryValue: {
        get() {
          return this.searchQuery;
        },
        set: debounce(function set(value) {
          this.setSearchQuery(value);
        }, 300),
      },
    },
    data: () => ({
      capitalizeFirstLetter,
      showSearchInput: false,
    }),
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
    height: $header-height;

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
    padding: 16px;

    @include between-children() {
      margin-right: 12px;
    }
  }

  .main-header__navigation {
    display: flex;
    align-items: center;
  }

  .main-header__navigation-name {
    font-size: 20px;
    font-weight: 500;
  }

  .main_header__controls {
    margin-left: auto;

    @include between-children() {
      margin-right: 8px;
    }
  }
</style>
