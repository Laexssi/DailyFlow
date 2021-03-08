<template>
  <div class="activity-card">
    <div class="activity-card__header">
      <span>
        {{ activityData.emoji }}
      </span>

      <v-btn
      icon
      small
      class="rounded-0">
        <v-icon color="black">
          mdi-dots-vertical
        </v-icon>
      </v-btn>
    </div>

    <div class="activity-card__name">
      {{ activityData.name }}
    </div>

    <div
    class="activity-card__labels">
      <v-chip
      v-for="label in activityData.labels"
      :key="label.id"
      class="d-inline-block"
      :color="label.color"
      textColor="white">
        {{ label.name }}
      </v-chip>
    </div>

    <div class="activity-card__controls">
      <v-btn
      class="mt-6 mb-6"
      outlined
      @click="onCompleteHandler(activityData)"
      :disabled="completeButtonDisabled">
        <template v-if="!completeButtonDisabled">
          <v-icon left>
            mdi-check
          </v-icon>

          Complete Now
        </template>

        <template v-else>
          {{ timeToRefresh }}
        </template>
      </v-btn>

      <div class="activity-card__complete-section">
        <div class="activity-card__counter mr-2">
          <div class="activity-card__counter-text">
            {{ activityData.complete_count }}
          </div>
        </div>

        <div
        v-if="lastCompleteDate"
        class="activity-card__complete-desc">
          <div>Completed last on</div>

          <div>{{ lastCompleteDate }}</div>

          <v-btn
          v-if="showCancelLastComplete"
          text
          xSmall
          class="activity-card__complete-button"
          @click="cancelLastCompleteHandler(activityData)">
            <v-icon>
              mdi-close
            </v-icon>

            <span class="activity-card__complete-button__desc">Cancel last complete</span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';
  import dayjs from 'dayjs';

  export default {
    name: 'ActivityCard',
    props: {
      activityData: {
        type: Object,
        default: () => {},
      },
    },
    created() {
      const INTERVAL = 5 * (10 ** 3);
      this.updateNowTimer = setInterval(() => { this.updateNow(); }, INTERVAL);
    },
    beforeDestroy() {
      clearInterval(this.updateNowTimer);
    },
    methods: {
      ...mapMutations({ setActivity: 'activity/setActivity' }),
      ...mapActions({
        updateActivityById: 'activityList/updateActivityById',
        completeActivity: 'activity/completeActivity',
        cancelLastComplete: 'activity/cancelLastComplete',
      }),
      async onCompleteHandler(activity) {
        await this.completeActivity(activity);
        await this.updateActivityById(activity);
      },
      async cancelLastCompleteHandler(activity) {
        await this.cancelLastComplete(activity);
        await this.updateActivityById(activity);
      },
      updateNow() {
        this.now = Date.now();
      },
    },
    computed: {
      lastCompleteDate() {
        if (!this.activityData.complete_dates[0]) return null;
        return dayjs(this.activityData.complete_dates[0]).format('DD, MMMM');
      },
      completeButtonDisabled() {
        if (!this.activityData.cooldown) return false;
        return this.now < this.activityData.cooldown_expiration_date;
      },
      timeToRefresh() {
        const time = dayjs(this.activityData.cooldown_expiration_date - this.now).format('H[H] m[M]');
        return `Cooldown ${time}`;
      },
      showCancelLastComplete() {
        return this.activityData.complete_count > 0;
      },
    },
    data: () => ({
      now: Date.now(),
      updateNowTimer: null,
    }),
  };
</script>

<style lang="scss">
  .activity-card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 288px;

    overflow: hidden;

    padding: 16px;
    background-color: $background-color;

    @include between-children() {
      margin-bottom: 8px;
    }
  }

  .activity-card__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    align-items: center;
  }

  .activity-card__name {
    font-size: 24px;
    font-weight: 400;

    color: black;
    @extend %one-line;
  }

  .activity-card__labels {
    display: flex;
    flex-flow: row wrap;

    @include between-children() {
      margin-right: 8px;
    }
  }

  .activity-card__counter {
    background: #F2F2F2;
    width: 86px;
    height: 86px;
    flex-shrink: 0;

    border-radius: 50%;
  }

  .activity-card__counter-text {
    font-size: 62px;
    line-height: 86px;
    text-align: center;
  }

  .activity-card__complete-section {
    display: flex;
    flex-flow: row nowrap;
    padding: 10px 0;

    justify-content: center;
    align-items: center;
  }

  .activity-card__complete-desc {
    flex-direction: column;
  }

  .activity-card__complete-button {
    padding: 0 !important;

    .activity-card__complete-button__desc {
      font-size: 12px;
      text-transform: none;
      text-decoration: underline;
    }
  }

  .activity-card__controls {
    display: flex;
    flex-direction: column;
    margin-top: auto;

    @include between-children() {
      margin-bottom: 8px;
    }
  }
</style>
