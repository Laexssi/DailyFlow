<template>
  <div class="activity-editor__add-label-container">
    <div class="activity-editor__add-label__header">
      <div class="activity-editor__add-label__controls">
        <span>Add activity</span>

        <v-icon
        @click="$emit('close')"
        dark>
          mdi-close
        </v-icon>
      </div>
    </div>

    <div
    class="activity-editor__input-wrapper">
      <v-text-field
      v-model="search"
      dark
      outlined
      placeholder="Search"
      appendIcon="mdi-magnify"/>
    </div>

    <div
    class="activity-editor__label-list">
      <div
      v-for="(item, idx) in filteredActivities"
      class="activity-editor__label-list__item"
      :key="idx">
        <span
        class="activity-editor__label-list__item-label__name">
          {{ item.name }}
        </span>

        <v-checkbox
        v-model="selectedActivities"
        class="mt-0 pt-0"
        :value="item.id"
        dark
        hideDetails/>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapActions, mapGetters, mapMutations, mapState,
  } from 'vuex';

  export default {
    name: 'PlanEditorAddActivityPopup',
    created() {
      if (!this.activityList.length) {
        this.updateActivityList();
      }

      this.selectedActivities = this.activities.map(({ id }) => id);
    },
    methods: {
      ...mapActions({
        updateActivityList: 'activityList/updateList',
      }),
      ...mapMutations({
        setActivities: 'planEditor/setActivities',
        setPlanKey: 'planEditor/setPlanKey',
      }),
      syncActivities() {
        this.setPlanKey({ key: 'activities', value: this.selectedActivities });
        this.setActivities(this.selectedActivities.map((item) => this.activityList.find(({ id }) => id === item)));
      },
    },
    computed: {
      ...mapState('planEditor', ['activities']),
      ...mapGetters({
        activityList: 'activityList/getList',
      }),
      filteredActivities() {
        if (!this.search) return this.activityList;
        return this.activityList.filter(({ name }) => name.includes(this.search));
      },
    },
    data: () => ({
      search: null,
      selectedActivities: [],
    }),
    watch: {
      'selectedActivities.length': {
        handler() {
          this.syncActivities();
        },
      },
    },
  };
</script>

<style lang="scss">
  .activity-editor__add-label-container {
    width: 100%;
    height: 100%;;
    background-color: #333333;

    display: flex;
    flex-direction: column;
  }

  .activity-editor__add-label__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;

    span {
      color: white;
      font-size: 16px;
    }
  }

  .activity-editor__add-label__controls {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
  }

  .activity-editor__input-wrapper {
    padding: 0 16px;
  }

  .activity-editor__label-list {
    display: flex;
    flex-direction: column;
    padding: 11px 0 28px 0;
    height: 226px;
    overflow-y: auto;
    border-top: 1px solid white;

    @include between-children() {
      margin-bottom: 16px;
    }
  }

  .activity-editor__label-list__item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
  }

  .activity-editor__label-list__item-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .activity-editor__label-list__item-label__name {
    color: white;
    max-width: 70%;

    @extend %one-line;
  }
</style>
