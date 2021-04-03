<template>
  <div class="main-screen__content main-screen__content--scroll">
    <div
    v-if="!loading"
    class="plan__list">
      <PlanCard
      v-for="item in list"
      :key="item.id"
      :plan="item"
      listMode/>
    </div>

    <div
    v-else
    class="plan__loader-wrapper">
      <v-progress-circular
      indeterminate/>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import PlanCard from 'components/PlanCard';

  export default {
    name: 'PlanList',
    components: { PlanCard },
    created() {
      this.updatePlanList()
        .finally(() => { this.loading = false; });
    },
    methods: {
      ...mapActions({
        updatePlanList: 'planList/updateList',
      }),
    },
    computed: {
      ...mapState('planList', ['list']),
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
</style>
