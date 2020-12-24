<template>
  <v-container fluid style="padding: 0;">
    <v-row no-gutters>
      <v-col sm="2" class="scrollable">
        <chats></chats>
      </v-col>
      <v-col sm="10" style="position: relative;">
        <div class="chat-container" ref="chatContainer">
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chats from './parts/Chats.vue'

export default {
  components: {
    'chats': Chats
  }
}
</script>

<style>
.scrollable {
  overflow-y: auto;
  height: 90vh;
}

.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}

</style>
