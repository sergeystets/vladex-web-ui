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
    this.$store.dispatch('connect');
    this.$store.dispatch('loadContacts');
  },
  components: {
    'chats': Chats,
    'message': Message,
  },
  computed: {
    messages() {
      return this.chatMessages;
    },
    chats() {
      return this.$store.getters.chats;
    },
    activeChatNewMessage() {
      return this.$store.getters.activeChatNewMessage;
    }
  },
  watch: {
    '$route.params.id'() {
      this.$store.dispatch("chatOpened", Number.parseInt(this.id));
      this.loadChat()
    },
    activeChatNewMessage(payload) {
      if (payload.chatId === Number.parseInt(this.id)) {
        this.chatMessages.push(this.formatMessage(payload));
      }
    },
    chats: function (newValue, oldValue) {
      if ((oldValue === undefined || oldValue.length === 0) && newValue) {
        this.$store.dispatch("chatOpened", Number.parseInt(this.id));
      }
    }
  },
  methods: {
    loadChat() {
      return api.loadChat(this.$store.getters.user.token, this.id).then(result => {
        result.data.forEach(message => {
          this.chatMessages.push(this.formatMessage(message));
        });
      })
    },

    scrollToEnd() {
      this.$nextTick(() => {
        var container = this.$el.querySelector('.chat-container');
        container.scrollTop = container.scrollHeight;
      })
    },

    formatMessage(message) {
      let date = message.timestamp ? new Date(message.timestamp * 1000) : new Date();
      const options = {month: 'long', year: 'numeric', day: 'numeric'}
      message.date = new Intl.DateTimeFormat('en-GB', options).format(date);
      message.timestampMinutesAndSeconds = date.getHours() + ":" + date.getMinutes();
      return message;
    },

    sendMessage() {
      if (this.content !== '') {
        this.$store.dispatch('sendMessage', {content: this.content, chatId: this.id});
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
  border-right: 1px solid #e1e4e8;
}

.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f8f9fa;
}

.vac-message-card {
  background: #fff;
  color: #0a0a0a;
  border-radius: 8px;
  font-size: 14px;
  padding: 6px 9px 3px;
  white-space: pre-line;
  max-width: 100%;
  -webkit-transition-property: box-shadow, opacity;
  transition-property: box-shadow, opacity;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: box-shadow;
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.1),
  0 1px 1px -1px rgba(0, 0, 0, 0.11), 0 1px 2px -1px rgba(0, 0, 0, 0.11);
}


.vac-message-box {
  display: flex;
  flex: 0 0 50%;
  max-width: 50%;
  justify-content: flex-start;
  line-height: 1.4;
}

.vac-message-container {
  position: relative;
  padding: 2px 10px;
  align-items: end;
  min-width: 100px;
  box-sizing: content-box;
}

.vac-message-container-offset {
  margin-top: 10px;
}

.vac-offset-current {
  margin-left: 50%;
  justify-content: flex-end;
}

.vac-message-card.own {
  background: #ccf2cf;
}

.vac-card-date {
  max-width: 150px;
  font-weight: 500;
  text-transform: uppercase;
  color: #505a62;
  background: #e5effa;
}

.vac-card-info {
  border-radius: 4px;
  text-align: center;
  margin: 10px auto;
  font-size: 12px;
  padding: 4px;
  display: block;
  overflow-wrap: break-word;
  position: relative;
  white-space: normal;
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.1),
  0 1px 1px -1px rgba(0, 0, 0, 0.11), 0 1px 2px -1px rgba(0, 0, 0, 0.11);
}

.vac-text-timestamp {
  font-size: 10px;
  color: #828c94;
  text-align: right;
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
