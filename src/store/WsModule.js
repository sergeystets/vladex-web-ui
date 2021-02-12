import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

const WsModule = {
  state: {
    socket: {},
    stompClient: {},
    webSocketState: "DISCONNECTED"
  },
  mutations: {
    setSocket(state, payload) {
      state.socket = payload
    },
    setStompClient(state, payload) {
      state.stompClient = payload
    },
    setWebSocketState(state, payload) {
      state.webSocketState = payload
    }
  },
  actions: {
    connect(context) {
      if (this.getters.webSocketState === "CONNECTED" && this.getters.webSocketState === "CONNECTING") {
        return;
      }
      let socket = new SockJS(process.env.VUE_APP_SERVER_URL + "/api/ws");
      let stompClient = Stomp.over(socket, {protocols: ["v12.stomp"]});
      context.commit("setWebSocketState", "CONNECTING");
      console.log("[ws] connecting...")
      stompClient.connect(
          {"X-Authorization": "Bearer " + context.getters.user.token.access_token},
          frame => {
            context.commit("setSocket", socket);
            context.commit("setStompClient", stompClient);
            context.commit("setWebSocketState", "CONNECTED");
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
            console.log("[ws] Connection failed: " + JSON.stringify(error));
            context.commit("setWebSocketState", "CONNECTION_FAILED");
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
    webSocketState(state) {
      return state.webSocketState;
    }
  }
}

export default WsModule
