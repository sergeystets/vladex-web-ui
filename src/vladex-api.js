import axios from 'axios'

const AXIOS = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL + "/api",
  timeout: 10000
})

export default {

  getUserInfo(token) {
    return AXIOS.get("/v1/me", {
      headers: {
        'Authorization': 'Bearer ' + token.access_token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
  }
}