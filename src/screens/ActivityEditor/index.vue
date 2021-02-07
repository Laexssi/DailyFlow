<template>
  <div class="activity-editor">
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
      <div class="activity-editor__cooldown-heading mb-1">
        <p>Cooldown period</p>
      </div>

      <div class="activity-editor__cooldown-row">
        <span> Every </span>
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
        </div>
        <span> hour </span>
      </div>
    </div>

    <div class="activity-editor__label-control mt-6">
      <span>
        Add label
      </span>

      <v-btn
      icon>
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </div>

    <div class="activity-editor__labels">
      <v-chip
      v-for="(item,index) of labels"
      :key="index"
      class="mr-2 mb-2"
      :color="item.color"
      textColor="white">
        {{ item.name }}
      </v-chip>
    </div>
  </div>
</template>

<script>
  import { VEmojiPicker, emojisDefault } from 'v-emoji-picker';

  import { mapGetters, mapMutations } from 'vuex';
  import debounce from 'lodash/debounce';

  export default {
    name: 'ActivityEditor',
    components: {
      VEmojiPicker,
    },
    created() {
      const randomIndex = Math.floor(Math.random() * 700);
      this.selectedEmoji = this.emojiList[randomIndex].data;

      this.setShowRouterBackButton(true);
    },
    destroyed() {
      this.setShowRouterBackButton(false);
    },
    methods: {
      ...mapMutations({
        setActivityKey: 'activityEditor/setActivityKey',
        setShowRouterBackButton: 'appState/setShowRouterBackButton',
      }),
      selectEmoji(emoji) {
        this.selectedEmoji = emoji.data;
      },
    },
    computed: {
      ...mapGetters({
        activity: 'activityEditor/getActivity',
        labels: 'activityList/getLabels',
      }),
      emojiList() {
        return emojisDefault.filter(({ category }) => this.emojiCategories.has(category));
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
      selectedEmoji: null,
      emojiCategories: new Set(['Activity', 'Peoples', 'Foods', 'Nature', 'Places']),
      cooldownTime: 0,
    }),
  };
</script>

<style lang="scss">
  .activity-editor {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

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
    width: 288px !important;
  }

  .activity-editor__cooldown-container {
    display: flex;
    flex-direction: column;
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
    width: 288px;

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
    justify-content: space-between;
    align-items: center;

    width: 288px;
    border-bottom: 1px solid #BDBDBD;
  }

  .activity-editor__labels {
    display: flex;
    flex-flow: row wrap;
    width: 288px;
  }
</style>
