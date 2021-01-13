import Vue from 'vue'
import Vuex from 'vuex'
import api from "@/vladex-api";

import AuthModule from './AuthModule'
import ChatModule from "@/store/ChatModule";

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth: AuthModule,
    chat: ChatModule,
  },
  state: {
    contacts: []
  },
  mutations: {
    setContacts(state, payload) {
      state.contacts = payload
    }
  },
  actions: {
    loadContacts(context) {
      api.getContacts(context.getters.user.token).then(res => {
        context.commit('setContacts', res.data);
      })
    }
  },
  getters: {
    contacts(state) {
      return state.contacts
    }
  }
})
