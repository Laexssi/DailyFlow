<template>
  <VEmojiPicker
  @select="$emit('select', $event)"
  :showCategories="false"
  :continuousList="true"
  :showSearch="false"
  :customEmojis="emojiList"/>
</template>

<script>
  import { VEmojiPicker } from 'v-emoji-picker';

  export default {
    name: 'ActivityEditorEmojiPicker',
    components: {
      VEmojiPicker,
    },
    props: {
      emojiList: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>

<style lang="scss">

</style>
