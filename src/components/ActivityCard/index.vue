<template>
  <div class="activity-card">
    <div class="activity-card__header">
      <span class="activity-card__header-text">
        {{ activityData.emoji }}
      </span>

      <v-menu
      v-model="menuOpen"
      :attach="`#anchor-${_uid}`"
      absolute
      offsetX
      offsetY
      nudgeLeft="230px"
      nudgeBottom="24px"
      minWidth="260px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
          icon
          small
          dark
          class="rounded-0 activity-card__anchor-button"
          v-bind="attrs"
          v-on="on"
          :id="`anchor-${_uid}`">
            <v-icon color="black">
              mdi-dots-vertical
            </v-icon>
          </v-btn>
        </template>

        <ActivityCardMenu
        :activity="activityData"
        @delete="deleteHandler"
        @edit="editHandler"
        @cancel="cancelLastCompleteHandler"/>
      </v-menu>
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
      @click="onCompleteHandler"
      :loading="buttonLoading">
        <v-icon left>
          mdi-check
        </v-icon>

        Complete Now
        <!--        <template v-else>-->
        <!--          {{ timeToRefresh }}-->
        <!--        </template>-->
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';
  import dayjs from 'dayjs';
  import ActivityCardMenu from './ActivityCardMenu';

  export default {
    name: 'ActivityCard',
    components: { ActivityCardMenu },
    props: {
      activityData: {
        type: Object,
        default: () => {},
      },
    },
    // created() {
    //   const INTERVAL = 5 * (10 ** 3);
    //   this.updateNowTimer = setInterval(() => { this.updateNow(); }, INTERVAL);
    // },
    // beforeDestroy() {
    //   clearInterval(this.updateNowTimer);
    // },
    methods: {
      ...mapMutations({ setActivity: 'activity/setActivity' }),
      ...mapActions({
        updateActivityById: 'activityList/updateActivityById',
        completeActivity: 'activity/completeActivity',
        cancelLastComplete: 'activity/cancelLastComplete',
        deleteActivity: 'activity/deleteActivity',
      }),
      async onCompleteHandler() {
        this.buttonLoading = true;
        await this.completeActivity(this.activityData);
        const delayPromise = new Promise((resolve) => {
          setTimeout(() => resolve(), 900);
        });
        Promise.allSettled([this.updateActivityById(this.activityData), delayPromise])
          .then(() => { this.buttonLoading = false; });
      },
      async cancelLastCompleteHandler() {
        await this.cancelLastComplete(this.activityData);
        await this.updateActivityById(this.activityData);
      },
      // updateNow() {
      //   this.now = Date.now();
      // },
      editHandler() {
        this.$router.push({ name: 'activity-editor-edit', params: { id: this.activityData.id } });
      },
      deleteHandler() {
        this.deleteActivity(this.activityData);
      },
    },
    computed: {
      lastCompleteDate() {
        if (!this.activityData.complete_dates.length) return null;
        return dayjs(this.activityData.complete_dates[this.activityData.complete_dates.length - 1]).format('DD, MMMM, HH:mm');
      },
      // completeButtonDisabled() {
      //   if (!this.activityData.cooldown) return false;
      //   return this.now < this.activityData.cooldown_expiration_date;
      // },
      // timeToRefresh() {
      //   const timeMs = this.activityData.cooldown_expiration_date - this.now;
      //   const mins = Math.floor(timeMs / 1000 / 60);
      //   const hours = Math.floor(mins / 60);
      //   return `Cooldown ${hours}H ${Math.floor(mins - (hours * 60))}M`;
      // },
    },
    data: () => ({
      // now: Date.now(),
      // updateNowTimer: null,
      menuOpen: false,
      buttonLoading: false,
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
    margin-bottom: 16px;

    @include between-children() {
      margin-bottom: 8px;
    }

    @include breakpoint-width(0, 768px) {
      width: 100%;
      margin-bottom: 0;
    }
  }

  .activity-card__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    align-items: center;

    .activity-card__header-text {
      text-align: center;
      font-size: 30px;
      line-height: 30px;
    }
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
      margin-bottom: 8px;
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

  .activity-card__anchor-button {
    position: relative;
  }
</style>
