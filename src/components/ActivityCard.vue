<template>
  <div class="activity-card">
    <div class="activity-card__header">
      <span>emoji</span>

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
      {{ card.name }}
    </div>

    <div>
      <v-chip
      class="d-inline-block"
      color="#EB5757"
      textColor="white">
        {{ card.label }}
      </v-chip>
    </div>

    <v-btn
    class="mt-6 mb-6"
    outlined
    @click="onCompleteHandler">
      <v-icon left>
        mdi-check
      </v-icon>

      Complete Now
    </v-btn>

    <div class="activity-card__complete-section">
      <div class="activity-card__counter mr-2">
        <div class="activity-card__counter-text">
          1
        </div>
      </div>

      <div class="activity-card__complete-desc">
        <div>Completed</div>

        <div>Last on 1, January</div>

        <v-btn
        text
        xSmall
        class="activity-card__complete-button">
          <v-icon>
            mdi-close
          </v-icon>

          <span class="activity-card__complete-button__desc">Cancel last complete</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ActivityCard',
    methods: {
      onCompleteHandler() {
      },
    },
    computed: {
      card() {
        return {
          id: '',
          name: 'Card name',
          emoji: '',
          label: 'Sports', //  id?
          labelColor: '',
          cooldownExpirationDate: null,
          completeCount: 0,
          lastCompleteDate: null,
        };
      },
    },
    data: () => ({
    }),
  };
</script>

<style lang="scss">
  .activity-card {
    display: flex;
    flex-direction: column;
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

  .activity-card__counter {
    background: #F2F2F2;
    width: 86px;
    height: 86px;
    flex-shrink: 0;

    border-radius: 50%;
  }

  .activity-card__counter-text {
    font-size: 62px;
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
</style>
