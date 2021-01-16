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
    },
    updatePresence(context, presence) {
      let contacts = context.getters.contacts;
      contacts.forEach(function (contact) {
        if (contact.id === presence.userId) {
          contact.online = presence.online;
        }
      });
      context.commit('setContacts', contacts);
    }
  },
  getters: {
    contacts(state) {
      return state.contacts
    }
  }
})
