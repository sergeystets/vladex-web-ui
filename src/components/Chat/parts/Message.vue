<template>
  <div>
    <v-card flat class="no_chats_selected"
            v-show="activeChat === undefined">
      <v-card-title style="color: #999" justify-center>{{ $t('text.no.chats.selected') }}</v-card-title>
    </v-card>

    <div v-for="(message, index) in messages" v-bind:key="index">

      <div class="vac-card-date vac-card-info"
           v-if="index === 0 || (index > 0 && messages[index - 1].date !== message.date)">
        {{ message.date }}
      </div>
      <div class="vac-message-box"
           :class="{ 'vac-offset-current' :message.user.id === currentUserId}">
        <div class="vac-message-container vac-message-container-offset">
          <div class="vac-message-card" :class="{own: message.user.id === currentUserId}">
            <div class="content">
              <div v-html="message.content"></div>
            </div>
            <div class="vac-text-timestamp"> {{ message.timestampMinutesAndSeconds }}</div>
          </div>
        </div>
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
    activeChat() {
      return this.$store.getters.activeChat;
    },
    currentUserId() {
      let user = this.$store.getters.user;
      return user === undefined ? undefined : user.id;
    }
  },
}
</script>

<style>

.no_chats_selected {
  display: flex;
  align-items: center;
  background: none !important;
  justify-content: center;
  height: 60vh;
}

</style>
