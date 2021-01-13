<template>
  <v-container fluid style="padding: 0;">
    <v-row no-gutters>
      <v-col sm="2" class="scrollable">
        <chats></chats>
      </v-col>
      <v-col sm="10" style="position: relative;">
        <div class="chat-container" ref="chatContainer">
          <message :messages="messages"></message>
        </div>
        <div class="typer">
          <input type="text" placeholder="Type here..." v-on:keyup.enter="sendMessage"
                 v-model="content">
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chats from './parts/Chats.vue'
import Message from './parts/Message.vue'
import api from '../../vladex-api'

export default {
  data() {
    return {
      content: '',
      chatMessages: []
    }
  },
  props: [
    'id'
  ],
  mounted() {
    this.loadChat();
    this.$store.dispatch('loadContacts')
  },
  components: {
    'chats': Chats,
    'message': Message,
  },
  computed: {
    messages() {
      return this.chatMessages
    },
  },
  watch: {
    '$route.params.id'() {
      this.loadChat()
    }
  },
  methods: {
    loadChat() {
      return api.loadChat(this.$store.getters.user.token, this.id).then(res => {
        this.chatMessages = res.data;
      })
    },

    scrollToEnd() {
      this.$nextTick(() => {
        var container = this.$el.querySelector('.chat-container')
        container.scrollTop = container.scrollHeight
      })
    },

    sendMessage() {
      if (this.content !== '') {
        this.chatMessages.push({id: this.id, content: this.content, user: this.$store.getters.user})
        this.content = '';
        this.scrollToEnd();
      }
    }
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

.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}

.chat-container .username {
  font-size: 18px;
  font-weight: bold;
}

.message {
  margin-bottom: 3px;
}

.message.own {
  text-align: right;
}

.message.own .content {
  background-color: lightskyblue;
}

.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, .2);
}

.typer input[type=text] {
  position: absolute;
  left: 2.5rem;
  padding: 1rem;
  width: 80%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
}

</style>
