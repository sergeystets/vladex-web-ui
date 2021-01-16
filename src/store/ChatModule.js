import api from "@/vladex-api";

const ChatModule = {
  state: {
    chats: {}
  },
  mutations: {
    setChats(state, payload) {
      state.chats = payload
    }
  },
  actions: {
    loadUserChats(context) {
      api.getChats(context.getters.user.token).then(res => {
        context.commit('setChats', res.data);
      })
    },
    sendMessage(context, payload) {
      let message = {content: payload.content, chatId: payload.chatId}
      context.getters.stompClient.send("/app/ws", JSON.stringify(message));
    }
  },
  getters: {
    chats(state) {
      return state.chats
    }
  }
}

export default ChatModule
