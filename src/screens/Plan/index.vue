<template>
  <div class="plan-wrapper">
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

          <v-btn
          icon
          @click="deleteHandler">
            <v-icon color="black">
              mdi-delete
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <div
    class="main-screen__content main-screen__content--scroll">
      <div
      v-if="!loading"
      class="plan">
        <PlanCard
        :plan="plan"
        @start="startHandler"
        @cancel="cancelHandler"
        @complete="completeHandler"/>

        <div
        class="plan__activities-list">
          <PlanActivityCard
          v-for="activity of activities"
          :key="activity.id"
          :activityData="activity"
          :running="plan.running"
          :done="checkIsActivityDone(activity.id)"/>
        </div>
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
  import PlanActivityCard from 'components/PlanActivityCard';

  export default {
    name: 'Plan',
    components: {
      PlanCard,
      PlanActivityCard,
    },
    async created() {
      await this.updatePlan({ id: this.$route.params.id });

      if (!this.plan) {
        await this.$router.push({ name: 'plans' });
      }

      await this.updatePlanActivities({ activities: this.plan.activities });
      this.setPlan(this.plan);
      this.loading = false;
    },
    methods: {
      ...mapMutations({
        setPlan: 'plan/setPlan',
        setEditPlan: 'planEditor/setPlan',
        setEditPlanActivities: 'planEditor/setActivities',
      }),
      ...mapActions({
        updatePlan: 'plan/updatePlan',
        updatePlanActivities: 'plan/updatePlanActivities',
        updatePlanRunning: 'plan/updatePlanRunning',
        resetPlanActivitiesCounter: 'plan/resetPlanActivitiesCounter',
        completePlan: 'plan/completePlan',
        deletePlan: 'plan/deletePlan',
      }),
      editHandler() {
        this.setEditPlan(this.plan);
        this.setEditPlanActivities(this.activities);
        this.$router.push({ name: 'plan-editor-edit', params: { id: this.plan.id }, query: { from: 'list' } });
      },
      async deleteHandler() {
        await this.deletePlan(this.plan.id);
        await this.$router.push({ name: 'plans' });
      },
      async startHandler() {
        await this.updatePlanRunning({ running: true });
      },
      async cancelHandler() {
        await this.updatePlanRunning({ running: false });
        await this.resetPlanActivitiesCounter();
      },
      async completeHandler() {
        await this.completePlan();
      },
      routerBackHandler() {
        this.$router.push({ name: 'plans' });
      },
      checkIsActivityDone(id) {
        return this.plan.done_activities.includes(id);
      },
    },
    computed: {
      ...mapState('plan', ['plan', 'activities']),
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

    overflow: hidden;
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

    @include between-children() {
      margin-bottom: 12px;
    }
  }

  .plan__activities-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    min-width: 0;
    @include between-children() {
      margin-bottom: 8px;
    }
  }
</style>
