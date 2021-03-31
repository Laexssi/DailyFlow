<template>
  <div class="plan-activity-card">
    <div class="plan-activity-card__header">
      <span class="plan-activity-card__emoji mr-2">
        {{ activityData.emoji }}
      </span>

      <span class="plan-activity-card__name">
        {{ activityData.name }}
      </span>

      <v-btn
      v-if="deletable"
      class="ml-auto"
      icon
      @click="$emit('delete', activityData.id)">
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
    </div>

    <div
    v-if="!deletable"
    class="d-flex align-center">
      <v-checkbox
      v-if="running"
      v-model="isCompleted"
      :readonly="!isLoaded"
      xLarge>
        Complete
      </v-checkbox>

      <span
      class="plan-activity-card__counter-text">
        Completed {{ activityData.complete_count }} times
      </span>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';

  export default {
    name: 'PlanActivityCard',
    props: {
      activityData: {
        type: Object,
        default: () => {},
      },
      running: {
        type: Boolean,
        default: false,
      },
      done: {
        type: Boolean,
        default: false,
      },
      deletable: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      ...mapMutations({
        setActivity: 'activity/setActivity',
        decrementDoneActivity: 'plan/decrementDoneActivity',
      }),
      ...mapActions({
        completeActivity: 'activity/completeActivity',
        cancelLastComplete: 'activity/cancelLastComplete',
        updateActivityById: 'plan/updateActivityById',
        completePlanActivity: 'plan/completePlanActivity',
        cancelCompletePlanActivity: 'plan/cancelCompletePlanActivity',
      }),
    },
    data() {
      return {
        isCompleted: this.done,
        isLoaded: true,
      };
    },
    watch: {
      async isCompleted(val) {
        this.isLoaded = false;
        if (val) {
          await this.completeActivity(this.activityData);
          await this.updateActivityById(this.activityData);
          await this.completePlanActivity({ activityId: this.activityData.id });
          this.isLoaded = true;
          return;
        }
        await this.cancelLastComplete(this.activityData);
        await this.updateActivityById(this.activityData);
        this.cancelCompletePlanActivity({ activityId: this.activityData.id });
        this.isLoaded = true;
      },
    },
  };
</script>

<style lang="scss">
  .plan-activity-card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 768px;
    min-width: 0;

    overflow: hidden;

    padding: 16px;
    background-color: $background-color;

    @include between-children() {
      margin-bottom: 8px;
    }

    @include breakpoint-width(0, 768px) {
      width: 100%;
    }
  }

  .plan-activity-card__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    min-width: 0;

    align-items: flex-start;
  }

  .plan-activity-card__emoji {
    font-size: 24px;
  }

  .plan-activity-card__name {
    font-size: 24px;
    font-weight: 400;
    min-width: 0;

    color: black;
    @extend %one-line;
  }

  .plan-activity-card__counter-text {
    font-size: 14px;
    color: #828282;
  }
</style>
