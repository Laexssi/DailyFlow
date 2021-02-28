<template>
  <div>
    <div class="activity-editor__add-label-container">
      <div class="activity-editor__add-label__header">
        <div v-if="!createMode" class="activity-editor__add-label__controls">
          <span>Add label</span>

          <v-icon
          @click="$emit('close')"
          dark>
            mdi-close
          </v-icon>
        </div>

        <div v-else class="activity-editor__add-label__controls">
          <v-icon
          @click="createMode = false"
          dark>
            mdi-arrow-left
          </v-icon>

          <span class="activity-editor__add-label__create-text">Create new label</span>
        </div>
      </div>

      <div class="activity-editor__input-wrapper">
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
        v-for="(item) in filteredLabels"
        class="activity-editor__label-list__item"
        :key="item.id">
          <div class="activity-editor__label-list__item-label">
            <v-checkbox
            v-model="selectedLabels"
            class="mt-0 pt-0"
            :value="item.id"
            dark
            hideDetails/>

            <v-chip
            :color="item.color"
            textColor="white">
              {{ item.name }}
            </v-chip>
          </div>

          <v-btn
          dark>
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
      </div>
      <!--      <div class="activity-editor__color-picker mb-4">-->
      <!--        <div-->
      <!--        v-for="(item, index) in colorList"-->
      <!--        :key="index"-->
      <!--        :style="{ backgroundColor: item}"-->
      <!--        class="activity-editor__color-button"-->
      <!--        :class="{ 'activity-editor__color-button&#45;&#45;mask' : currentColor !== item }"-->
      <!--        @click="currentColor = item"/>-->
      <!--      </div>-->
      <!--      <v-text-field-->
      <!--      v-model="labelName"-->
      <!--      dark-->
      <!--      outlined-->
      <!--      label="Name"/>-->

      <!--      <v-btn-->
      <!--      large-->
      <!--      width="100%"-->
      <!--      @click="createLabelHandler">-->
      <!--        <v-icon-->
      <!--        left>-->
      <!--          mdi-plus-->
      <!--        </v-icon>-->
      <!--        Create-->
      <!--      </v-btn>-->
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce';
  import find from 'lodash/find';
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    name: 'ActivityEditorLabel',
    created() {
      this.selectedLabels = this.currentLabels.map(({ id }) => id);
    },
    methods: {
      ...mapMutations({
        setCurrentLabels: 'activityEditor/setLabels',
        deleteLabel: 'label/deleteLabel',
        addLabel: 'activityList/addLabel',
      }),
      ...mapActions({
        createLabel: 'labelEditor/createLabel',
        updateLabelList: 'labelList/updateList',
      }),
      syncCurrentLabels() {
        const currentLabels = this.selectedLabels.map((selectedId) => {
          return find(this.allLabels, ({ id }) => id === selectedId) || null;
        }).filter((item) => item);
        this.setCurrentLabels(currentLabels);
      },
      createLabelHandler() {
        this.createLabel({ color: this.currentColor, name: this.currentLabelName });
        this.currentColor = null;
        this.currentLabelName = null;
        this.$emit('close');
      },
    },
    computed: {
      ...mapGetters({
        allLabels: 'labelList/getList',
        currentLabels: 'activityEditor/getLabels',
      }),
      filteredLabels() {
        if (!this.search) return this.allLabels;
        return this.allLabels.filter(({ name }) => name.includes(this.search));
      },
      labelName: {
        get() {
          return this.currentLabelName;
        },
        set: debounce(function set(value) {
          this.currentLabelName = value;
        }, 300),
      },
    },
    data: () => ({
      colorList: ['#EB5757', '#F2994A', '#219653', '#2F80ED', '#9B51E0'],
      currentColor: null,
      currentLabelName: null,
      selectedLabels: [],
      createMode: false,
      search: '',
    }),
    watch: {
      'selectedLabels.length': {
        handler() {
          this.syncCurrentLabels();
        },
      },
    },
  };
</script>

<style lang="scss">
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

  .activity-editor__add-label__create-text {
    justify-self: center;
  }

  .activity-editor__input-wrapper {
    padding: 0 16px;
  }

  .activity-editor__label-list {
    display: flex;
    flex-direction: column;
    padding: 11px 16px 28px 16px;
    height: 226px;
    overflow-y: auto;

    @include between-children() {
      margin-top: 16px;
    }
  }

  .activity-editor__label-list__item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .activity-editor__label-list__item-label {
    display: flex;
    align-items: center;

    @include between-children() {
      margin-right: 8px;
    }
  }
</style>
