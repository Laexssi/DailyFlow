<template>
  <div
  v-if="showNavigation"
  class="navigation-wrapper">
    <div
    class="navigation">
      <v-btn
      v-for="(item, index) of navigationControls"
      :key="index"
      fab
      xSmall
      elevation="0"
      :color="item.isActive? 'white' : '#333333'"
      @click="switchRouteHandler(item.route)">
        <img v-if="item.iconSrc" :src="item.iconSrc" alt="icon">

        <v-icon
        v-else
        :color="item.isActive ? '#333333': 'white'"
        size="20">
          {{ item.icon }}
        </v-icon>
      </v-btn>

      <v-menu
      offsetY
      :nudgeTop="6"
      top
      left>
        <template
        v-slot:activator="{ on, attrs }">
          <v-btn
          fab
          xSmall
          elevation="0"
          color="#333333"
          v-bind="attrs"
          v-on="on">
            <v-icon
            :color="'white'"
            size="20">
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </template>

        <div class="navigation-menu__content">
          MORE
        </div>
      </v-menu>
    </div>

    <v-btn
    fab
    elevation="0"
    color="#333333"
    @click="addNewEntity">
      <v-icon color="white">
        mdi-plus
      </v-icon>
    </v-btn>
  </div>
</template>

<script>

  export default {
    name: 'Navigation',
    methods: {
      switchRouteHandler(route) {
        this.$router.push({ name: route });
      },
      addNewEntity() {
        const routeTo = {
          library: 'activity-editor-new',
        }[this.$route.name];

        this.$router.push({ name: routeTo });
      },
    },
    computed: {
      showNavigation() {
        const noNavRoutes = ['login', 'activity-editor-edit', 'activity-editor-new', 'plan'];
        return !noNavRoutes.includes(this.$route.name);
      },
      navigationControls() {
        return [{
                  icon: 'mdi-star',
                  route: 'library',
                  isActive: this.$route.name === 'library',
                },
                {
                  icon: 'mdi-list-status',
                  route: 'plans',
                  isActive: this.$route.name === 'plans',
                },
                {
                  icon: 'mdi-poll',
                  route: 'analytics',
                  isActive: this.$route.name === 'analytics',
                }];
      },
    },
    data: () => ({
    }),
  };
</script>

<style lang="scss">

  .navigation-wrapper {
    display: flex;
    flex-direction: row;

    position: fixed;
    left: 50%;
    bottom: 16px;
    transform: translate(-50%, 0);

    @include between-children() {
      margin-right: 24px;
    }
  }
  .navigation {
    display: flex;
    flex-direction: row;

    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 31px;

    padding: 12px 14px;

    background-color: $dark-gray;
    @include between-children() {
      margin-right: 16px;
    }
  }

  .navigation-menu__content {
    padding: 8px;
    background-color: #333333;
    color: white;

    .v-menu__content {
      box-shadow: none;
    }
  }
</style>
