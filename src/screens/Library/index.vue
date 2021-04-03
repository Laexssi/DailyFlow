<template>
  <div class="main-screen__content main-screen__content--scroll">
    <div
    v-if="!loading"
    class="library__list">
      <ActivityCard
      v-for="item in activityList"
      :key="item.id"
      :activityData="item"/>
    </div>

    <div
    v-else
    class="library__loader-wrapper">
      <v-progress-circular
      indeterminate/>
    </div>
  </div>
</template>

<script>
  import ActivityCard from 'components/ActivityCard';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'ActivityList',
    components: { ActivityCard },
    created() {
      const listsData = [this.updateActivityList(), this.updateLabelList()];
      Promise.all(listsData)
        .then(() => {
          this.loading = false;
        })
        .catch((e) => console.warn(e));
    },
    methods: {
      ...mapActions({
        updateActivityList: 'activityList/updateList',
        updateLabelList: 'labelList/updateList',
      }),
    },
    computed: {
      ...mapGetters({
        activityList: 'activityList/getList',
        labelList: 'labelList/getList',
      }),
    },
    data: () => ({
      loading: true,
    }),
  };
</script>

<style lang="scss">
  .library__loader-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    padding: 16px;
  }

  .library__list {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;

    padding-bottom: 76px;

    @include between-children() {
      margin-right: 16px;
    }

    @include breakpoint-width(0, 768px) {
      flex-flow: column nowrap;
      align-items: center;

      @include between-children() {
        margin-right: 0;
        margin-bottom: 16px;
      }
    }
  }
</style>
