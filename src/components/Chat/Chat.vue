<template>
  <v-container fluid style="padding: 0;">
    <v-row no-gutters>
      <v-col sm="2" class="scrollable"
             :class="{ 'vac-rooms-container-full': isMobile }">
        <chats v-show="showRoomsList"></chats>
      </v-col>
      <v-col v-show="(isMobile && !showRoomsList) || !isMobile" :sm="!showRoomsList ? 12 : 10"
             :style="{position: !showRoomsList ? 'absolute': 'relative'}">
        <div class="chat-container"
             ref="chatContainer">
          <message :messages="messages"></message>
        </div>

        <div class="vac-box-footer">
          <!-- typer (text area) -->
          <textarea
              ref="roomTextarea"
              :placeholder="$t('placeholder.typer.type.message')"
              class="vac-textarea"
              style="min-height: 20px; padding-left: 12px"
              v-model="content"
              v-on:keyup.enter="sendMessage"
          ></textarea>

          <div class="vac-icon-textarea">
            <div
                @click="sendMessage"
                class="vac-svg-button"
                :class="{ 'vac-send-disabled': inputDisabled, 'vac-icon-send':!inputDisabled }"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  :class="{'vac-icon-send-disabled':inputDisabled}"
                  version="1.1"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
              >
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
              </svg>
            </div>
          </div>
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
      chatMessages: [],
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

  created() {
    this.updateResponsive()
    window.addEventListener('resize', ev => {
      if (ev.isTrusted) {
        this.updateResponsive()
      }
    })
  },
  components: {
    'chats': Chats,
    'message': Message,
  },
  computed: {
    inputDisabled() {
      return this.isMessageEmpty()
    },
    isMobile() {
      return this.$store.getters.isMobile;
    },
    showRoomsList() {
      return this.$store.getters.showRoomsList;
    },
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
    updateResponsive() {
      let mobile = window.innerWidth < 900;
      this.$store.dispatch('updateResponsive', mobile);
    },
    isMessageEmpty() {
      return !this.content.trim()
    },
    loadChat() {
      if (this.isMobile) {
        this.$store.dispatch("updateShowRoomsList", false)
      }
      this.chatMessages = [];
      console.log("mobile: " + this.isMobile + ", showRoomsList: " + this.showRoomsList)
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
      message.date = new Intl.DateTimeFormat(navigator.language.split('-')[0], options).format(date);
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
  height: 94vh;
  border-right: 1px solid #e1e4e8;
}

.chat-container {
  box-sizing: border-box;
  height: calc(104vh - 9.7rem);
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

.vac-rooms-container-full {
  flex: 0 0 100%;
  max-width: 100%;
}

.vac-text-timestamp {
  font-size: 10px;
  color: #828c94;
  text-align: right;
}

.vac-icon-send-disabled {
  fill: #9ca6af;
}

.vac-icon-send {
  fill: #1976d2;
}

.vac-icon-textarea {
  display: flex;
  margin: 12px 0 0 5px;
}

.vac-icon-textarea svg {
  margin: 0 7px;
}

.vac-room-footer {
  width: 100%;
  border-bottom-right-radius: 4px;
  z-index: 10;
}

.vac-box-footer {
  display: flex;
  position: relative;
  background: #f8f9fa;
  padding: 10px 8px 10px;
}

.vac-textarea {
  height: 20px;
  width: 100%;
  line-height: 20px;
  overflow: hidden;
  outline: 0;
  resize: none;
  border-radius: 20px;
  padding: 12px 16px;
  box-sizing: content-box;
  font-size: 16px;
  background: #fff;
  color: #0a0a0a;
  caret-color: #1976d2;
  border: 1px solid #e1e4e8
}

.vac-textarea::placeholder {
  color: #9ca6af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
