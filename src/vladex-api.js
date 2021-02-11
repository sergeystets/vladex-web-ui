import axios from 'axios'

const AXIOS = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL + "/api",
  timeout: 10000
})

export default {

  getUserInfo(token) {
    return AXIOS.get("/v1/me", {
      headers: {
        'Authorization': 'Bearer ' + token.access_token
      }
    });
  },
  getContacts(token) {
    return AXIOS.get("/v1/contact", {
      headers: {
        'Authorization': 'Bearer ' + token.access_token
      }
    });
  },
  getChats(token) {
    return AXIOS.get("/v1/chat", {
      headers: {
        'Authorization': 'Bearer ' + token.access_token
      }
    });
  },

  loadChatMessages(token, id) {
    return AXIOS.get("/v1/chat/" + id + "/messages", {
      headers: {
        'Authorization': 'Bearer ' + token.access_token
      }
    });
  }
}