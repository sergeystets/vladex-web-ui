import api from "@/vladex-api";

const AuthModule = {
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload) {
      if (payload === undefined) {
        localStorage.removeItem("user");
      } else {
        localStorage.setItem("user", JSON.stringify(payload));
      }
      state.user = payload
    },
    initializeStore(state) {
      state.user = JSON.parse(localStorage.getItem("user"));
    }
  }
  ,
  actions: {
    signIn() {
      window.location = process.env.VUE_APP_AUTH_URL + "/oauth/authorize"
          + "?response_type=token"
          + "&client_id=vladex-web-ui"
          + "&scope=API"
          + "&redirect_uri=" + window.location.origin + "/sign-in/success"
          + "&grant_type=implicit"
    },

    logout({commit}) {
      commit('setUser', undefined);
    },

    signInSuccess({commit}) {
      let queryStringToJson = function (query) {
        if (query === "") {
          return {};
        }
        let segments = query.split("&").map(s => s.split("="));
        let json = {};
        segments.forEach(s => json[s[0]] = s[1]);
        return json;
      }

      let token = queryStringToJson(window.location.hash.replace("#", ''));
      api.getUserInfo(token).then(user => {
        user.data.token = token;
        commit("setUser", user.data);
      });
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  }
}

export default AuthModule
