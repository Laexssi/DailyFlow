<template>
  <div
  class="activity-card__menu-content">
    <template v-if="!deleteConfirmation">
      <v-btn
      dark
      width="100%"
      color="#333333"
      @click="$emit('edit')">
        Edit

        <v-icon>
          mdi-pencil
        </v-icon>
      </v-btn>

      <v-btn
      dark
      width="100%"
      color="#333333"
      @click.stop="deleteConfirmation = true">
        Delete

        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>

      <v-btn
      v-if="activity.complete_count > 0"
      dark
      width="100%"
      color="#333333"
      @click.stop="$emit('cancel')">
        Undo last complete

        <v-icon>
          mdi-undo
        </v-icon>
      </v-btn>
    </template>

    <template v-else>
      <div class="activity-card__menu-content__header">
        <v-btn
        xSmall
        dark
        width="100%"
        color="#333333"
        @click="deleteConfirmation = false">
          <v-icon>
            mdi-arrow-left
          </v-icon>

          <span>
            Back to menu
          </span>
        </v-btn>
      </div>

      <div class="activity-card__menu-content__desc">
        Are you sure you want to delete this activity? This action can not be undone
      </div>

      <div
      class="activity-card__menu-content__controls">
        <v-btn
        medium
        :loading="deleteLoading"
        @click="$emit('delete'); deleteLoading = true">
          Delete

          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>

        <v-btn
        medium
        @click="deleteConfirmation = false">
          Cancel

          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>

  export default {
    name: 'ActivityCardMenu',
    props: {
      activity: {
        type: Object,
        default: () => ({}),
      },
    },
    data: () => ({
      deleteConfirmation: false,
      deleteLoading: false,
    }),
    watch: {
      menuOpen(val) {
        if (!val) setTimeout(() => { this.deleteConfirmation = false; }, 300);
      },
    },
  };
</script>

<style lang="scss">
  .activity-card__menu-content {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background-color: #333333;
    color: white;

    .v-menu__content {
      box-shadow: none;
    }

    .v-btn__content {
      justify-content: space-between;
    }
  }

  .activity-card__menu-content__desc {
    text-transform: none;
    word-break: break-word;
    white-space: normal;
    margin: 12px 0;
  }

  .activity-card__menu-content__controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

</style>
