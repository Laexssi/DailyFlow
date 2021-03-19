<template>
  <div class="main-screen__content main-screen__content--scroll">
    <div
    class="main-header">
      <div class="main-header__content">
        <div class="main-header__navigation">
          <v-btn
          icon
          large
          class="mr-2"
          @click="routerBackHandler">
            <v-icon>
              mdi-arrow-left
            </v-icon>
          </v-btn>

          <div
          v-if="!loading"
          class="main-header__navigation-name">
            {{ plan.name }}
          </div>
        </div>

        <div class="main_header__controls">
          <v-btn
          icon
          @click="editHandler">
            <v-icon color="black">
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <div class="plan__wrapper">
      <div v-if="!loading" class="plan">
        <PlanCard
        :plan="plan"/>
      </div>

      <div
      v-else
      class="plan__loader-wrapper">
        <v-progress-circular
        indeterminate/>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapState } from 'vuex';
  import PlanCard from 'components/PlanCard';

  export default {
    name: 'Plan',
    components: { PlanCard },
    async created() {
      if (this.plan) {
        this.loading = false;
        return;
      }

      await this.updatePlan({ id: this.$route.params.id });

      if (!this.plan) {
        await this.$router.push({ name: 'plans' });
      }

      await this.updatePlanActivities({ activities: this.plan.activities });
      this.setPlan(this.plan);
      this.loading = false;
    },
    methods: {
      ...mapMutations({ setPlan: 'plan/setPlan' }),
      ...mapActions({ updatePlan: 'plan/updatePlan', updatePlanActivities: 'plan/updatePlanActivities' }),
      editHandler() {
        this.$router.push({ name: 'plan-editor-edit', params: { id: this.plan.id } });
      },
      routerBackHandler() {
        this.$router.go(-1);
      },
    },
    computed: {
      ...mapState('plan', ['plan']),
      ...mapState('planList', ['list']),
    },
    data: () => ({
      loading: true,
    }),
  };
</script>

<style lang="scss">
  .plan-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .plan__loader-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    padding: 16px;
  }

  .plan__wrapper {
    display: flex;
    justify-content: center;
  }

  .plan {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex-grow: 1;

    max-width: 768px;

    padding: 16px;

    @include between-children() {
      margin-bottom: 12px;
    }
  }
</style>
