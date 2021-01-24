import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

const WsModule = {
  state: {
    socket: {},
    stompClient: {},
    webSocketConnected: false
  },
  mutations: {
    setSocket(state, payload) {
      state.socket = payload
    },
    setStompClient(state, payload) {
      state.stompClient = payload
    },
    setWebSocketConnected(state, payload) {
      state.webSocketConnected = payload
    }
  },
  actions: {
    connect(context) {
      let socket = new SockJS(process.env.VUE_APP_SERVER_URL + "/api/ws");
      let stompClient = Stomp.over(socket);
      stompClient.connect(
          {"X-Authorization": "Bearer " + context.getters.user.token.access_token},
          frame => {
            context.commit("setSocket", socket);
            context.commit("setStompClient", stompClient);
            context.commit("setWebSocketConnected", true);
            console.log("[ws][connect-frame] " + frame);
            stompClient.subscribe("/topic/presence", tick => {
              console.log("[ws][tick][/topic/presence] " + tick);
              let presence = JSON.parse(tick.body);
              context.dispatch('updatePresence', presence);
            });

            console.log("subscribing to '/user/queue/chat'...")
            stompClient.subscribe("/user/queue/chat", tick => {
              console.log("received tick from /user/queue/chat " + tick);
              let message = JSON.parse(tick.body);
              context.dispatch('onNewMessageReceived', message)
            });
          },
          error => {
            console.log("[ws][error] " + error);
            context.commit("setWebSocketConnected", false);
          }
      );
    },

  },
  getters: {
    socket(state) {
      return state.socket;
    },
    stompClient(state) {
      return state.stompClient;
    },
    webSocketConnected(state) {
      return state.webSocketConnected;
    }
  }
}

export default WsModule
