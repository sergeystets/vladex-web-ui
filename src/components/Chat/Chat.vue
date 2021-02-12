<template>
  <div class="window-container">
    <div class="vac-card-window" style="height: calc(100vh - 57px)">
      <div class="vac-chat-container">
        <div class="vac-rooms-container"
             v-show="showRoomsList"
             :class="{ 'vac-rooms-container-full': isMobile }">

          <!-- Room List -->
          <div class="vac-room-list">
            <chats></chats>
          </div>

          <!-- Create new chat button (mobile only)-->
          <v-fab-transition>
            <v-btn @click="onAddNewGroupDialogClicked"
                   v-show="isMobile & showRoomsList && scrollUp"
                   style="bottom: 32px"
                   color="#2d83c4"
                   dark
                   absolute
                   bottom
                   right
                   fab
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>

          <!-- Create new chat dialog -->
          <v-dialog
              v-model="createChatDialog"
              max-width="500px"
          >

            <v-card>
              <v-toolbar color="#2d83c4" fixed>
                <v-btn icon dark @click="createChatDialog = false">
                  <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title class="white--text"> {{ $t('label.create.new.chat') }}</v-toolbar-title>
              </v-toolbar>

              <v-card-text>
                <!-- Contacts list -->
                <v-list>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      {{ $t('label.new.chat.dialog.selected') }} ({{ newChatMembers.length }})
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-list>
                  <v-list-item
                      :style="{
                  'background-color': newChatMembers.some((el) => el === user.id) ? '#cce0ef': 'white',
                  cursor: 'pointer'
                }"
                      v-for="user in contacts" v-bind:key="user.id">
                    <v-badge
                        bordered
                        bottom
                        :color="user.online?'green accent-4' : 'grey lighten-2'"
                        dot
                        offset-x="10"
                        offset-y="10"
                    >
                      <v-list-item-avatar>
                        <img :src="user.avatar" alt="avatar"/>
                      </v-list-item-avatar>

                    </v-badge>
                    <v-list-item-content @click="addOrRemoveNewChatMember(user.id)">
                      <v-list-item-title>{{ user.username }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>


              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    color="primary"
                    @click="cancelAddNewGroupDialog"
                >
                  {{ $t('label.cancel.new.chat.dialog') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </div>

        <!-- Chat Room -->
        <div class="vac-col-messages" v-show="(isMobile && !showRoomsList) || !isMobile" :sm="!showRoomsList ? 12 : 10">
          <div class="vac-container-scroll" ref="chatContainer">
            <message :messages="messages"></message>
          </div>

          <div class="vac-room-footer">
            <div class="vac-box-footer">
              <!-- typer (text area) -->
              <textarea
                  ref="roomTextarea"
                  :placeholder="$t('placeholder.typer.type.message')"
                  class="vac-textarea"
                  style="min-height: 20px; padding-left: 12px"
                  v-model="content"
                  v-on:keyup="onKeyUp($event)"
                  v-on:keydown="onKeyDown($event)"
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
          </div>
        </div>
      </div>
    </div>
  </div>
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
      scrollUp: true,
      createChatDialog: false,
      newChatMembers: []
    }
  },
  props: [
    'id'
  ],
  mounted() {
    if (this.id) {
      this.loadChat();
    }
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
    contacts() {
      return this.$store.getters.contacts;
    },
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
    },
    webSocketState() {
      return this.$store.getters.webSocketState;
    }
  },
  watch: {
    '$route.params.id'() {
      this.$store.dispatch("chatOpened", this.id ? Number.parseInt(this.id) : undefined);
      this.loadChat()
    },
    webSocketState(wsState) {
      if (wsState === "CONNECTION_FAILED") {
        console.log("[ws] Re-connecting in 10 seconds...")
        let that = this;
        setTimeout(function () {
          that.$store.dispatch('connect');
        }, 10000);
      }
    },
    activeChatNewMessage(payload) {
      if (payload.chatId === Number.parseInt(this.id)) {
        this.chatMessages.push(this.formatMessage(payload));
      }
    },
    chats: function (newValue, oldValue) {
      if ((oldValue === undefined || oldValue.length === 0) && newValue && this.id) {
        this.$store.dispatch("chatOpened", Number.parseInt(this.id));
      }
    }
  },
  methods: {
    onKeyDown(e) {
      if (13 === e.keyCode) {
        e.preventDefault();
      }
    },
    onKeyUp(e) {
      if (13 === e.keyCode && !(e.ctrlKey || e.shiftKey)) {
        this.sendMessage();
      }
      if (13 === e.keyCode && (e.ctrlKey || e.shiftKey)) {
        this.content = this.content + "\n";
      }
    },
    cancelAddNewGroupDialog() {
        this.createChatDialog = false;
        this.newChatMembers = [];
    },
    onAddNewGroupDialogClicked() {
        this.createChatDialog = !this.createChatDialog;
        this.newChatMembers = [];
    },
    addOrRemoveNewChatMember(id) {
      if (this.newChatMembers.some((el) => el === id)) {
        for (let i = 0; i < this.newChatMembers.length; i++) {
          if (this.newChatMembers[i] === id) {
            this.newChatMembers.splice(i, 1);
          }
        }
      } else {
        this.newChatMembers.push(id)
      }
    },
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
      if (this.id) {
        return api.loadChatMessages(this.$store.getters.user.token, this.id).then(result => {
          result.data.forEach(message => {
            this.chatMessages.push(this.formatMessage(message));
          });
        })
      }
    },

    scrollToEnd() {
      this.$nextTick(() => {
        let container = this.$el.querySelector('.vac-container-scroll');
        container.scrollTop = container.scrollHeight;
      })
    },

    formatMessage(message) {
      let date = message.timestamp ? new Date(message.timestamp) : new Date();
      const options = {month: 'long', year: 'numeric', day: 'numeric'}
      message.date = new Intl.DateTimeFormat(navigator.language.split('-')[0], options).format(date);
      message.timestampMinutesAndSeconds = date.getHours() + ":" + date.getMinutes();
      return message;
    },

    sendMessage() {
      this.content = this.content.trim();
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

.window-container {
  width: 100%;
}

/* chat container for chats + active chat */

.vac-card-window {
  width: 100%;
  display: block;
  max-width: 100%;
  overflow-wrap: break-word;
  position: relative;
  white-space: normal;
}

.vac-chat-container {
  height: 100%;
  display: flex;
  background-color: #f8f9fa;
}

/* room list */

.vac-rooms-container {
  display: flex;
  flex-flow: column;
  flex: 0 0 22%;
  min-width: 260px;
  max-width: 500px;
  position: relative;
  background: #fff;
  height: 100%;
}

.vac-rooms-container-full {
  flex: 0 0 100%;
  max-width: 100%;
}

.vac-room-list {
  flex: 1;
  position: relative;
  max-width: 100%;
  cursor: pointer;
  overflow-y: auto;
  border-right: 1px solid #e1e4e8;
}

/* Chat room */

.vac-col-messages {
  position: relative;
  height: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-flow: column;
}

.vac-container-scroll {
  flex: 1;
  overflow-y: auto;
  margin-right: 1px;
  -webkit-overflow-scrolling: touch;
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
  padding-bottom: 10px;
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
