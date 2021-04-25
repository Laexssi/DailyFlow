<template>
  <div class="main-screen__content main-screen__content--scroll">
    <template v-if="!loading">
      <div
      v-if="filteredActivityList.length"
      class="library__list">
        <ActivityCard
        v-for="item in filteredActivityList"
        :key="item.id"
        :activityData="item"/>
      </div>

      <div
      v-else
      class="library__wrapper">
        <p>No any activities found</p>
      </div>
    </template>

    <div
    v-else
    class="library__wrapper">
      <v-progress-circular
      indeterminate/>
    </div>
  </div>
</template>

<script>
  import ActivityCard from 'components/ActivityCard';
  import {
    mapActions, mapGetters, mapMutations, mapState,
  } from 'vuex';

  export default {
    name: 'ActivityList',
    components: { ActivityCard },
    created() {
      this.setShowSearchButton(true);
      Promise.all([this.updateActivityList(), this.updateLabelList()])
        .then(() => {
          this.loading = false;
        })
        .catch((e) => console.warn(e));
    },
    beforeRouteLeave(to, from, next) {
      this.setShowSearchButton(false);
      next();
    },
    methods: {
      ...mapActions({
        updateActivityList: 'activityList/updateList',
        updateLabelList: 'labelList/updateList',
      }),
      ...mapMutations({
        setShowSearchButton: 'appState/setShowSearchButton',
      }),
      getLabelMatch(labels) {
        if (!labels.length) return false;
        return labels.filter(({ name }) => name.toLowerCase().includes(this.searchQuery.toLowerCase())).length;
      },
    },
    computed: {
      ...mapState('appState', ['searchQuery']),
      ...mapGetters({
        activityList: 'activityList/getList',
        labelList: 'labelList/getList',
      }),
      filteredActivityList() {
        if (!this.searchQuery) return this.activityList;

        return this.activityList.filter(({ name, labels }) => name.toLowerCase().includes(this.searchQuery.toLowerCase()) || this.getLabelMatch(labels));
      },
    },
    data: () => ({
      loading: true,
    }),
  };
</script>

<style lang="scss">
  .library__wrapper {
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
