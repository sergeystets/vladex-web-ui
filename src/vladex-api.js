import axios from 'axios'

const AXIOS = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL,
  timeout: 10000
})

export default {

  login(phoneNumber) {
    return AXIOS.post("/v1/login", {phoneNumber: phoneNumber});
  },
}