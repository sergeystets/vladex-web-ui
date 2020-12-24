<template>
  <div>
    <div class="message" v-for="(message, index) in messages" v-bind:key="index" :class="{own: message.user.id === currentUserId}">
      <!-- let's show username only once in case he sent several messages -->
      <div class="username" v-if="index === 0 || (index > 0 && messages[index - 1].user.id !== message.user.id)">{{ message.user.username }}</div>
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
      return 42;
    }
  },
}
</script>
