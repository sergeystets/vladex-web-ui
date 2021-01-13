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
    }
  },
  getters: {
    chats(state) {
      return state.chats
    }
  }
}

export default ChatModule
