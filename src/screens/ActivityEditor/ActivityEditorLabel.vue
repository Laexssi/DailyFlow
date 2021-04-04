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
          @click="setCreateModeHandler"
          dark>
            mdi-arrow-left
          </v-icon>

          <span class="activity-editor__add-label__create-text">{{ editMode ? 'Edit label' : 'Create new label' }}</span>
        </div>
      </div>

      <div
      class="activity-editor__input-wrapper">
        <v-text-field
        v-if="!createMode"
        v-model="search"
        dark
        outlined
        placeholder="Search"
        appendIcon="mdi-magnify"/>

        <v-text-field
        v-else
        v-model="newLabelName"
        dark
        outlined
        placeholder="Name"/>
      </div>

      <div
      v-if="!createMode"
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
          dark
          color="#333333"
          depressed
          @click="editLabelHandler(item)">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
      </div>

      <div
      v-else
      class="activity-editor__color-picker__container">
        <span
        class="activity-editor__color-picker__text">
          Please select color or we set it random
        </span>

        <div class="activity-editor__color-picker">
          <div
          v-for="(item, index) in colorList"
          :key="index"
          :style="{ backgroundColor: item}"
          class="activity-editor__color-button"
          @click="newLabelColor = item">
            <v-icon
            v-if="newLabelColor === item"
            color="white">
              mdi-check
            </v-icon>
          </div>
        </div>
      </div>

      <v-btn
      v-if="!createMode && !editMode"
      dark
      xLarge
      color="#333333"
      @click="createMode = true">
        Create new

        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>

      <v-btn
      v-if="createMode && !editMode"
      xLarge
      :dark="!newLabelName"
      :disabled="!newLabelName"
      :loading="createLoading"
      @click="createLabelHandler">
        Create

        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>

      <div
      v-if="editMode"
      class="activity-editor__edit-controls">
        <v-btn
        class="activity-editor__edit-controls__button"
        color="#EB5757"
        @click="deleteLabelHandler">
          Delete
        </v-btn>

        <v-btn
        class="activity-editor__edit-controls__button"
        dark
        color="#333333"
        @click="saveEditedLabelHandler">
          Save
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce';
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    name: 'ActivityEditorLabel',
    created() {
      if (!this.currentLabels.length) {
        this.selectedLabels = [];
        return;
      }
      this.selectedLabels = this.currentLabels;
    },
    methods: {
      ...mapMutations({
        setCurrentLabels: 'activityEditor/setLabels',
        setCurrentLabel: 'labelEditor/setLabel',
      }),
      ...mapActions({
        createLabel: 'labelEditor/createLabel',
        editLabel: 'labelEditor/editLabel',
        updateLabelList: 'labelList/updateList',
        deleteLabel: 'label/deleteLabel',
      }),
      syncCurrentLabels() {
        this.setCurrentLabels(this.selectedLabels);
      },
      editLabelHandler(item) {
        this.setCurrentLabel(item);
        this.createMode = true;
        this.newLabelName = this.currentLabel.name;
        this.newLabelColor = this.currentLabel.color;
      },
      async createLabelHandler() {
        this.createLoading = true;
        if (!this.newLabelColor) this.setRandomLabelColor();
        const newLabelId = await this.createLabel({ color: this.newLabelColor, name: this.newLabelName });
        await this.updateLabelList();

        const newLabel = this.allLabels.find(({ id }) => id === newLabelId);

        this.selectedLabels.push(newLabel.id);

        this.clearData();
        this.createLoading = false;
      },
      async saveEditedLabelHandler() {
        this.setCurrentLabel({
          ...this.currentLabel,
          name: this.newLabelName || this.currentLabel.name,
          color: this.newLabelColor || this.currentLabel.color,
        });
        await this.editLabel();
        await this.updateLabelList();

        this.clearData();
      },
      async deleteLabelHandler() {
        const deletedId = await this.deleteLabel(this.currentLabel);
        await this.updateLabelList();
        this.selectedLabels = this.selectedLabels.filter((id) => id !== deletedId);
        this.clearData();
      },
      clearData() {
        this.newLabelColor = null;
        this.newLabelName = null;
        this.createMode = false;
        this.setCurrentLabel(null);
      },
      setCreateModeHandler() {
        this.createMode = false;
        this.clearData();
      },
      setRandomLabelColor() {
        const randomIndex = Math.floor(Math.random() * this.colorList.length);
        this.newLabelColor = this.colorList[randomIndex];
      },
    },
    computed: {
      ...mapGetters({
        allLabels: 'labelList/getList',
        currentLabels: 'activityEditor/getLabels',
        currentLabel: 'labelEditor/getLabel',
      }),
      filteredLabels() {
        if (!this.search) return this.allLabels;
        return this.allLabels.filter(({ name }) => name.includes(this.search));
      },
      labelName: {
        get() {
          return this.newLabelName;
        },
        set: debounce(function set(value) {
          this.newLabelName = value;
        }, 300),
      },
      editMode() {
        return this.createMode && this.currentLabel?.id;
      },
    },
    data: () => ({
      colorList: ['#EB5757', '#F2994A', '#F2C94C', '#219653', '#6FCF97', '#2F80ED', '#56CCF2', '#9B51E0', '#EB57B0'],
      newLabelColor: null,
      newLabelName: null,
      selectedLabels: [],
      createMode: false,
      createLoading: false,
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
    margin-right: calc(50% - 59px);
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
    border-bottom: 1px solid white;

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

    @include between-children() {
      margin-right: 8px;
    }
  }

  .activity-editor__color-picker__container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 226px;
    padding: 0 16px;

    @include between-children() {
      margin-bottom: 24px;
    }
  }

  .activity-editor__color-picker__text {
    color: white;
    font-size: 16px;
  }

  .activity-editor__color-picker {
    display: flex;
    flex-flow: row wrap;
    align-content: center;

    @include between-children() {
      margin-right: 18px;
      margin-bottom: 24px;
    }
  }

  .activity-editor__color-button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 38px;
    height: 38px;
    border-radius: 50%;

    cursor: pointer;
  }

  .activity-editor__edit-controls {
    display: flex;
    width: 100%;
    justify-content: center;

    @include between-children() {
      margin-right: 24px;
    }
  }

  .activity-editor__edit-controls__button {
    flex-grow: 1;
  }
</style>
