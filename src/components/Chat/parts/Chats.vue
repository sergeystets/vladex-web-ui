<template>
  <v-list subheader>
    <v-subheader>Your Chats</v-subheader>
    <v-list-item v-for="chat in chats" v-bind:key="chat.name" :to="/chat/ + chat.id">
      <v-list-item-content>
        <v-list-item-title v-html="chat.name"></v-list-item-title>
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
    }
  }
}
</script>
