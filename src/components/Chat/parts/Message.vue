<template>
  <div>
    <div class="message" v-for="(message, index) in messages" v-bind:key="index"
         :class="{own: message.user.id === currentUserId}">
      <div style="margin-top: 5px"></div>
      <div class="content">
        <div v-html="message.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'messages'
  ],
  computed: {
    currentUserId() {
      return this.$store.getters.user.id;
    }
  },
}
</script>
