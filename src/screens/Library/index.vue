<template>
  <div class="library-wrapper">
    <v-tabs
    v-model="tab"
    backgroundColor="transparent"
    color="basil"
    grow>
      <v-tab
      v-for="item in tabItems"
      :key="item.route"
      :to="{ name: item.routeName }">
        {{ item.text }}
      </v-tab>
    </v-tabs>

    <div class="main-screen__content">
      <router-view/>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Library',
    computed: {
      tabItems() {
        return [
          {
            text: 'Library',
            routeName: 'library',
          },
          {
            text: 'List',
            routeName: 'library-list',
          },
        ];
      },
    },
    data: () => ({
      tab: 'library',
    }),
  };
</script>

<style lang="scss">
  .library-wrapper {
    display: flex;
    flex-direction: column;
  }

</style>
