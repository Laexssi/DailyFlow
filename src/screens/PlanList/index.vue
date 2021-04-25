<template>
  <div class="main-screen__content main-screen__content--scroll">
    <template
    v-if="!loading">
      <div
      v-if="filteredList.length"
      class="plan__list">
        <PlanCard
        v-for="item in filteredList"
        :key="item.id"
        :plan="item"
        listMode/>
      </div>

      <div
      v-else
      class="plan__wrapper">
        <p>No any plans found</p>
      </div>
    </template>

    <div
    v-else
    class="plan__loader-wrapper">
      <v-progress-circular
      indeterminate/>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapState } from 'vuex';
  import PlanCard from 'components/PlanCard';

  export default {
    name: 'PlanList',
    components: { PlanCard },
    created() {
      this.setShowSearchButton(true);
      this.updatePlanList()
        .finally(() => { this.loading = false; });
    },
    beforeRouteLeave(to, from, next) {
      this.setShowSearchButton(false);
      next();
    },
    methods: {
      ...mapActions({
        updatePlanList: 'planList/updateList',
      }),
      ...mapMutations({
        setShowSearchButton: 'appState/setShowSearchButton',
      }),
    },
    computed: {
      ...mapState('planList', ['list']),
      ...mapState('appState', ['searchQuery']),
      filteredList() {
        if (!this.searchQuery) return this.list;

        return this.list.filter(({ name }) => name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      },
    },
    data: () => ({
      loading: true,
    }),
  };
</script>

<style lang="scss">
  .plan__loader-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    padding: 16px;
  }

  .plan__list {
    display: flex;
    justify-content: center;
    overflow-y: auto;
    flex-flow: column nowrap;
    align-items: center;

    padding-bottom: 76px;

    @include between-children() {
      margin-bottom: 16px;
    }
  }

  .plan_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    padding: 16px;
  }
</style>
