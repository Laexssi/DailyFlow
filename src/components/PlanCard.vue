<template>
  <div class="plan-card">
    <div
    v-if="listMode"
    class="plan__name">
      {{ plan.name }}
    </div>

    <div class="plan__activities-count">
      <span class="plan__activities-count__text">
        Activities
      </span>

      <span class="plan__activities-count__count">
        {{ activitiesCount }}
      </span>
    </div>

    <v-progress-linear
    v-if="plan.running"
    color="#6FCF97"
    :value="completeStatus"
    height="8"/>

    <div
    v-if="plan.running"
    class="plan__activities-expiration">
      List will be completed on {{ expirationDate }}
    </div>

    <v-btn
    v-if="listMode"
    outlined
    @click="openHandler">
      Open
    </v-btn>

    <div
    v-if="!listMode"
    class="plan__controls">
      <v-btn
      v-if="!plan.running"
      outlined
      @click="$emit('start')">
        Start
      </v-btn>

      <div
      v-else
      class="d-flex">
        <v-btn
        outlined
        @click="$emit('complete')"
        class="mr-2">
          Complete now
        </v-btn>

        <v-btn
        outlined
        @click="$emit('cancel')">
          Cancel
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import { mapMutations } from 'vuex';

  export default {
    name: 'PlanCard',
    props: {
      plan: {
        type: Object,
        default: () => ({}),
      },
      listMode: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      ...mapMutations({ setPlan: 'plan/setPlan' }),
      openHandler() {
        this.setPlan(this.plan);
        this.$router.push({ name: 'plan', params: { id: this.plan.id } });
      },
    },
    computed: {
      activitiesCount() {
        return this.plan.running
          ? `${this.plan.done_activities.length}/ ${this.plan.activities.length}`
          : `${this.plan.activities.length}`;
      },
      completeStatus() {
        return (this.plan.done_activities.length / this.plan.activities.length) * 100;
      },
      expirationDate() {
        return dayjs(this.plan.cooldown_expiration_date).format('DD, MMMM');
      },
    },
    data: () => ({
      now: Date.now(),
    }),
  };
</script>

<style lang="scss">
  .plan-card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 100%;

    overflow: hidden;

    padding: 16px;
    background-color: $background-color;

    @include between-children() {
      margin-bottom: 8px;
    }

    @include breakpoint-width(0, 812px) {
      width: 100%;
    }
  }

  .plan__name {
    font-size: 24px;
    font-weight: 400;

    color: black;
    @extend %one-line;
  }

  .plan__activities-count {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .plan__activities-count__text {
    font-size: 14px;
  }

  .plan__activities-count__count {
    font-size: 24px;
  }

  .plan__activities-expiration {
    color: #BDBDBD;
  }

  .plan__controls {
    display: flex;
    flex-direction: row;
  }
</style>
