import Vue from 'vue'
import Vuex from 'vuex'

import AuthModule from './AuthModule'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth: AuthModule,
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
    loadContacts({commit}) {
      commit('setContacts', [
        {
          user: {
            id: 1,
            username: "Pavel Burykh",
            online: true,
            avatar: "https://randomuser.me/api/portraits/men/79.jpg"
          }
        },
        {
          user: {
            id: 2,
            username: "Valeriia Stets",
            online: true,
            avatar: "https://randomuser.me/api/portraits/women/57.jpg"
          }
        },
        {
          user: {
            id: 3,
            username: "Andrii Chupyr",
            online: false,
            avatar: "https://randomuser.me/api/portraits/men/56.jpg"
          }
        }]
      )
    },
  },
  getters: {
    contacts(state) {
      return state.contacts
    }
  }
})
