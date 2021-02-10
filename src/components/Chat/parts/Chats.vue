<template>
  <v-list>
    <v-list-item :class="{'vac-chat-message-mobile': isMobile}"
                 v-for="chat in chats" v-bind:key="chat.name"
                 v-on:click="onChatClicked(chat)">
      <v-list-item-content>
        <v-list-item-title v-text="getChatName(chat)"></v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <!--online-->
        <v-badge v-show="chat.unreadMessages !== undefined && chat.unreadMessages.length > 0"
                 :content="chat.unreadMessages ? chat.unreadMessages.length: 0"
                 color="grey darken-1"
        ></v-badge>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('loadUserChats')
  },
  computed: {
    chats() {
      return this.$store.getters.chats
    },
    isMobile() {
      return this.$store.getters.isMobile;
    }
  },
  methods: {
    getChatName(chat) {
      return !chat.peerToPeer ? chat.name : chat.members.find(m => m.id !== this.$store.getters.user.id).username;
    },
    onChatClicked(chat) {
      if (this.$store.getters.activeChatId === chat.id && !this.$store.getters.isMobile) {
        return;
      }
      if (this.$store.getters.activeChatId === chat.id && this.$store.getters.isMobile) {
        this.$store.dispatch("updateShowRoomsList", false);
      } else {
        this.$router.push("/chat/" + chat.id);
      }
    }
  }
}
</script>

<style>

.vac-chat-message-mobile {
  border-bottom: 1px solid #eee;
}

</style>