<template>
  <div>
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
            <div class="vac-text-timestamp"> {{ message.timestampMinutesAndSeconds}}</div>
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
    currentUserId() {
      return this.$store.getters.user.id;
    }
  },
}
</script>
