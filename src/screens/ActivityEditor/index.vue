<template>
  <div class="activity-editor__wrapper">
    <div v-if="!loading" class="activity-editor">
      <v-menu offsetY>
        <template
        v-slot:activator="{ on, attrs }">
          <v-btn
          class="emoji-button mt-8"
          text
          small
          v-bind="attrs"
          v-on="on">
            {{ selectedEmoji }}
          </v-btn>
        </template>

        <VEmojiPicker
        @select="selectEmoji"
        :showCategories="false"
        :continuousList="true"
        :customEmojis="emojiList"/>
      </v-menu>

      <v-text-field
      v-model="activityName"
      outlined
      class="activity-editor__input"
      label="Name"/>

      <div class="activity-editor__cooldown-container mt-1">
        <div class="activity-editor__cooldown-row">
          <div class="activity-editor__cooldown-heading mb-1 text-center">
            <span>Cooldown period</span>
          </div>

          <div class="activity-editor__cooldown-controls">
            <v-btn
            fab
            xSmall
            elevation="0"
            color="#BDBDBD"
            :disabled="cooldownTime === 0"
            @click="cooldownTime--">
              <v-icon>
                mdi-chevron-left
              </v-icon>
            </v-btn>

            <div class="activity-editor__cooldown-value">
              <span> {{ cooldownTime }} </span>
            </div>

            <v-btn
            fab
            xSmall
            elevation="0"
            color="#BDBDBD"
            @click="cooldownTime++">
              <v-icon>
                mdi-chevron-right
              </v-icon>
            </v-btn>

            <div class="ml-2">
              <span>hour</span>
            </div>
          </div>
        </div>
      </div>

      <div class="activity-editor__label-control mt-6">
        <v-dialog
        v-model="showLabelPopup"
        maxWidth="768">
          <template
          v-slot:activator="{ on, attrs }">
            <v-btn
            class="activity-editor__add-label"
            outlined
            large
            width="100%"
            v-bind="attrs"
            v-on="on">
              Add labels
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>

          <ActivityEditorLabel
          v-if="showLabelPopup"
          @close="showLabelPopup = false"/>
        </v-dialog>
      </div>

      <div class="activity-editor__labels">
        <div v-if="currentLabels.filter((item) => item).length">
          <v-chip
          v-for="(item) of currentLabels"
          :key="item.id"
          class="mr-2 mb-2"
          :color="item.color"
          textColor="white"
          close
          @click:close="removeLabel(item.id)">
            {{ item.name }}
          </v-chip>
        </div>
      </div>

      <div
      v-if="showCreateButton"
      class="activity-editor__create-button__wrapper">
        <v-btn
        xLarge
        dark
        rounded
        width="100%"
        @click="createActivityHandler">
          {{ editMode ? 'Edit' : 'Create' }}
        </v-btn>
      </div>
    </div>

    <div v-else class="activity-editor__skeleton-wrapper">
      <v-skeleton-loader
      class="activity-editor__skeleton"
      type="card"
      maxWidth="768"/>
    </div>
  </div>
</template>

<script>
  import ActivityEditorLabel from './ActivityEditorLabel';
  import { VEmojiPicker, emojisDefault } from 'v-emoji-picker';
  import { mapGetters, mapMutations, mapActions } from 'vuex';

  import debounce from 'lodash/debounce';
  import find from 'lodash/find';

  export default {
    name: 'ActivityEditor',
    components: {
      VEmojiPicker,
      ActivityEditorLabel,
    },
    created() {
      const listsData = [this.updateActivityList(), this.updateLabelList()];
      Promise.all(listsData)
        .then(() => {
          if (this.$route.params.id) {
            this.editMode = true;
            const editingActivity = this.activityList.find(({ id }) => id === this.$route.params.id);
            editingActivity.labels = editingActivity.labels.map((label) => label.id);
            this.setActivity(editingActivity);
            this.cooldownTime = this.activity.cooldown / 3600 / 1000;
          }
          this.loading = false;
        })
        .catch((e) => console.warn(e));
      this.setShowRouterBackButton(true);
    },
    mounted() {
      this.randomizeEmoji();
    },
    destroyed() {
      this.setShowRouterBackButton(false);
    },
    methods: {
      ...mapMutations({
        setActivity: 'activityEditor/setActivity',
        setActivityKey: 'activityEditor/setActivityKey',
        removeLabel: 'activityEditor/removeLabel',
        setShowRouterBackButton: 'appState/setShowRouterBackButton',
      }),
      ...mapActions({
        updateActivityList: 'activityList/updateList',
        updateLabelList: 'labelList/updateList',
        createActivity: 'activityEditor/createActivity',
        editActivity: 'activityEditor/editActivity',
      }),
      async createActivityHandler() {
        if (this.editMode) {
          await this.editActivity();
          await this.$router.push({ name: 'library' });
          return;
        }
        await this.createActivity();
        await this.$router.push({ name: 'library' });
      },
      randomizeEmoji() {
        const randomIndex = Math.floor(Math.random() * 700);
        this.setActivityKey({ key: 'emoji', value: this.emojiList[randomIndex].data });
      },
      selectEmoji(emoji) {
        this.selectedEmoji = typeof emoji === 'string' ? emoji : emoji.data;
      },
    },
    computed: {
      ...mapGetters({
        activity: 'activityEditor/getActivity',
        activityList: 'activityList/getList',
        labelList: 'labelList/getList',
        currentLabelsById: 'activityEditor/getLabels',
      }),
      emojiList() {
        return emojisDefault.filter(({ category }) => this.emojiCategories.has(category));
      },
      selectedEmoji: {
        get() {
          return this.activity?.emoji;
        },
        set(emoji) {
          this.setActivityKey({ key: 'emoji', value: emoji });
        },
      },
      showCreateButton() {
        return this.activity.name;
      },
      currentLabels() {
        return this.currentLabelsById.map((item) => find(this.labelList, ({ id }) => id === item));
      },
      activityName: {
        get() {
          return this.activity.name;
        },
        set: debounce(function set(value) {
          this.setActivityKey({ key: 'name', value });
        }, 300),
      },
    },
    data: () => ({
      loading: true,
      editMode: false,
      emojiCategories: new Set(['Activity', 'Peoples', 'Foods', 'Nature', 'Places']),
      cooldownTime: 0,
      showLabelPopup: false,
    }),
    watch: {
      cooldownTime(value) {
        const normalizedValue = value * 60 * 60 * 1000;
        this.setActivityKey({ key: 'cooldown', value: normalizedValue });
      },
    },
  };
</script>

<style lang="scss">
  .activity-editor__wrapper {
    display: flex;
    justify-content: center;
  }

  .activity-editor {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex-grow: 1;

    max-width: 768px;

    padding: 16px;

    @include between-children() {
      margin-bottom: 12px;
    }
  }

  .emoji-button {
    justify-content: center;
    height: 36px !important;
    min-width: 36px !important;
    width: 36px !important;
    padding-left: 6px !important;
    padding-right: 6px !important;

    span {
      text-align: center;
      font-size: 30px;
      line-height: 30px;
    }
  }

  .activity-editor__input {
    min-width: 288px !important;
    width: 100% !important;
  }

  .activity-editor__cooldown-container {
    display: flex;
    flex-direction: column;

    width: 100%;
  }

  .activity-editor__cooldown-heading {
    p {
      color: #333333;
    }
  }

  .activity-editor__cooldown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 288px;
    width: 100%;

    span {
      text-align: center;
    }
  }

  .activity-editor__cooldown-controls {
    display: flex;
    align-items: center;
    justify-content: center;

    @include between-children() {
      margin-right: 4px;
    }
  }

  .activity-editor__cooldown-value {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    text-align: center;

    background-color: #BDBDBD;

      span {
        font-size: 16px;
        color: white;
        line-height: 32px;
      }
  }

  .activity-editor__label-control {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 100%;
    border-bottom: 1px solid #BDBDBD;
  }

  .activity-editor__add-label {
    justify-content: space-between !important;
  }

  .activity-editor__labels {
    display: flex;
    flex-flow: row wrap;

    width: 100%;
    min-width: 288px;
  }

  .activity-editor__add-label-container {
    width: 100%;
    height: 100%;;
    background-color: #333333;

    display: flex;
    flex-direction: column;
  }

  .activity-editor__color-button--mask {
    opacity: 0.3;
  }

  .activity-editor__create-button__wrapper {
    display: flex;
    flex-direction: row;

    position: fixed;
    left: 50%;
    bottom: 16px;
    transform: translate(-50%, 0);

    width: 75vw;
  }

  .activity-editor__skeleton-wrapper {
    display: flex;
    justify-content: center;

    width: 100%;
    padding: 16px;
  }

  .activity-editor__skeleton {
    width: 100%;
  }
</style>
