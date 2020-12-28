import api from '../vladex-api'

const AuthModule = {
  state: {
    user: null,
    phone: null,
    verifyPhoneLoading: false,
    loadingOtp: false,
    otpExpirationSeconds: null
  },
  mutations: {
    setVerifyPhoneLoading(state, payload) {
      state.verifyPhoneLoading = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setPhone(state, payload) {
      state.phone = payload
    },
    setLoadingOtp(state, payload) {
      state.loadingOtp = payload
    },
    setOtpExpirationSeconds(state, payload) {
      state.otpExpirationSeconds = payload
    },
    initializeStore(state) {
      state.user = JSON.parse(localStorage.getItem("user"));
    }
  }
  ,
  actions: {
    verifyPhone({commit}, payload) {
      commit('setVerifyPhoneLoading', true)
      api.login(payload.phone).then(function (response) {
        commit('setVerifyPhoneLoading', false)
        commit('setPhone', payload.phone);
        commit('setOtpExpirationSeconds', response.data.otpExpirationSeconds)
      });
    },
    verifyOtp({commit}, payload) {
      commit('setLoadingOtp', true)
      setTimeout(function () {
        commit('setLoadingOtp', false)
        let user = {user: {id: 42, username: "Sergii Stets"}};
        localStorage.setItem("user", JSON.stringify(user));
        commit("setUser", user);
      }, 4000);

    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    verifyPhoneLoading(state) {
      return state.verifyPhoneLoading;
    },
    loadingOtp(state) {
      return state.loadingOtp;
    },
    phone(state) {
      return state.phone;
    },
    otpExpirationSeconds(state) {
      return state.otpExpirationSeconds;
    }
  }
}

export default AuthModule
