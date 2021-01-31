import api from "@/vladex-api";

const ChatModule = {
  state: {
    chats: [],
    activeChatId: undefined,
    activeChat: undefined,
    activeChatNewMessage: {},
    isMobile: false,
    showRoomsList: true
  },
  mutations: {
    setActiveChatId(state, payload) {
      state.activeChatId = payload
    },
    setIsMobile(state, payload) {
      state.isMobile = payload
    },
    setShowRoomsList(state, payload) {
      state.showRoomsList = payload
    },
    setActiveChat(state, payload) {
      state.activeChat = payload
    },
    setChats(state, payload) {
      state.chats = payload
    },
    setActiveChatNewMessage(state, payload) {
      state.activeChatNewMessage = payload
    }
  },
  actions: {
    updateShowRoomsList(context, showRoomsList){
      context.commit("setShowRoomsList", showRoomsList);
    },
    goBackToRoomsList(context) {
      context.commit("setShowRoomsList", true);
    },
    updateResponsive(context, mobile) {
      let switchedToMobile = !context.getters.isMobile && mobile;
      if (switchedToMobile || !mobile) {
        context.commit("setShowRoomsList", true);
      }
      context.commit("setIsMobile", mobile);
    },
    chatOpened(context, payload) {
      console.log("chat " + payload + " was opened and is now active");
      context.commit("setActiveChatId", payload)
      let activeChat = context.getters.chats.filter(chat => chat.id === payload);
      if (activeChat !== undefined) {
        context.commit('setActiveChat', activeChat[0]);
      }
    },
    loadUserChats(context) {
      api.getChats(context.getters.user.token).then(res => {
        context.commit('setChats', res.data);
      })
    },
    sendMessage(context, payload) {
      let message = {content: payload.content, chatId: payload.chatId}
      context.getters.stompClient.send("/app/ws", JSON.stringify(message));
    },
    onNewMessageReceived(context, message) {
      if (message.chatId === context.getters.activeChatId) {
        context.commit('setActiveChatNewMessage', message);
      }

      if (message.user.id !== context.getters.user.id) {
        // update unread messages count to be displayed on a left side bar
        let chats = JSON.parse(JSON.stringify(context.getters.chats));
        chats.forEach(function (chat) {
          if (chat.id === message.chatId) {
            let unreadMessages = chat.unreadMessages;
            if (unreadMessages === undefined) {
              unreadMessages = [];
            }
            unreadMessages.push(message)
            chat.unreadMessages = unreadMessages;
          }
        });
        context.commit('setChats', chats);
      }
    },
  },
  getters: {
    isMobile(state) {
      return state.isMobile;
    },
    showRoomsList(state) {
      return state.showRoomsList;
    },
    chats(state) {
      return state.chats
    },
    activeChatId(state) {
      return state.activeChatId;
    },
    activeChat(state) {
      return state.activeChat;
    },
    activeChatNewMessage(state) {
      return state.activeChatNewMessage;
    },
  }
}

export default ChatModule
