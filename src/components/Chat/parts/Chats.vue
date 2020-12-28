<template>
  <v-list subheader>
    <v-subheader>Your Chats</v-subheader>
    <v-list-item avatar v-for="(chat, index) in chats" v-bind:key="chat.name" :to="/chat/ + index">
      <v-list-item-content>
        <v-list-item-title v-html="chat.name"></v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-icon>mdi-chat</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  computed: {
    chats() {
      return [
        {name: "Pavel Burykh"},
        {name: "Valeriia Stets"},
        {name: "Andrii Chupyr"},
        {name: "Теорема Эскобара"},
        {name: "May the force be with you"},
        {name: "Харьков 1654"},
        {name: "Chat 1"},
        {name: "Chat 2"},
        {name: "Chat 3"},
        {name: "Chat 4"},
        {name: "Chat 5"},
        {name: "Chat 6"},
        {name: "Chat 7"},
        {name: "Chat 8"},
        {name: "Chat 9"},
      ]
    }
  }
}
</script>
