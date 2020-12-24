<template>
  <div>
    <v-container>
      <v-layout column align-center justify-center>
        <h1 class="mb-2 di 1 text-center">Welcome To Vladex Messenger</h1>
        <v-btn class="mt-12" color="blue lighten-2" dark large to="/chat/0">
          Get started
        </v-btn>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Chats from './Chat/parts/Chats.vue'

export default {
  components: {
    'chats': Chats
  }
}
</script>
