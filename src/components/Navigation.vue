<template>
  <div
  v-if="showNavigation"
  class="navigation">
    Navigation
  </div>
</template>

<script>
  export default {
    name: 'Navigation',
    computed: {
      showNavigation() {
        return this.$route.name !== 'login';
      },
    },
  };
</script>

<style lang="scss">
  .navigation {
    position: fixed;
    left: 50%;
    bottom: 16px;
    transform: translate(-50%, 0);

    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 31px;

    padding: 12px 14px;

    background-color: $navigation-background-color;
  }
</style>
