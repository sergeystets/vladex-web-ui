<template>

  <div>
    <v-card flat>
      <v-card flat>
        <v-card-title>
          <video controls autoplay playsinline ref="localVideo" :height="100" :muted="true" :id=-1></video>
        </v-card-title>
      </v-card>
      <v-card flat>
        <v-card-title class="justify-center">
          <video controls autoplay playsinline ref="remoteVideo" :height="360" :muted="true" :id="id"></video>
        </v-card-title>
      </v-card>
      <v-card style="min-height: 100%" flat>
        <v-card-title class="justify-center">
          <!--offer video call button -->
          <v-btn v-on:click="offerVideoCall()">
            <v-icon>mdi-video</v-icon>
          </v-btn>
          <!--leave button -->
          <v-btn v-on:click="leave()">
            <v-icon color="red">mdi-phone-hangup</v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
    </v-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      localStream: null,
      remoteStream: null,
      pc: null
    }
  },
  watch: {
    async offer(offer) {
      console.log("new offer arrived: " + JSON.stringify(offer));

      await alert(offer.callerName + " is calling...");

      await this.initConnection();

      // prepare answer
      await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answerDescription = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answerDescription);

      this.$store.getters.stompClient.send("/app/ws/signaling/answer", JSON.stringify(answerDescription));
    },

    async answer(answer) {
      console.log("got the answer " + JSON.stringify(answer));
      if (!this.pc.currentRemoteDescription) {
        let answerDescription = new RTCSessionDescription(answer);
        await this.pc.setRemoteDescription(answerDescription);
      }
    },

    async iceCandidate(payload) {
      if (!this.pc) {
        await this.initConnection();
      }

      if (payload && payload.candidate) {
        let candidate = JSON.parse(payload.candidate)
        console.log("got new ice candidate: " + JSON.stringify(payload));
        if (candidate) {
          await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }
    },
  },
  computed: {
    offer() {
      return this.$store.getters.getOffer;
    },
    answer() {
      return this.$store.getters.getAnswer;
    },
    iceCandidate() {
      return this.$store.getters.getIceCandidate;
    }
  },
  props: [
    'id'
  ],
  methods: {
    supportsUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },

    initIceCandidate: function () {
      // send ice candidate
      this.pc.onicecandidate = event => {
        console.log("on ice candidate " + JSON.stringify(event.candidate))
        event.candidate &&
        this.$store.getters.stompClient.send("/app/ws/signaling/ice-candidate",
            JSON.stringify({
              chatId: this.id,
              candidate: JSON.stringify(event.candidate.toJSON())
            }));
      }
    },

    async initConnection() {
      if (!this.supportsUserMedia()) {
        alert("The browser does not support video conferencing :(");
      }

      let constraints = {
        video: true,
        audio: false
      };
      const servers = {
        iceServers: [{urls: ['stun:stun.l.google.com:19302']}]
      }

      // create peer connection
      this.pc = new RTCPeerConnection(servers);
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.remoteStream = new MediaStream();

      this.localStream.getTracks().forEach(track => {
        this.pc.addTrack(track, this.localStream);
      });

      this.pc.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
          this.remoteStream.addTrack(track);
        })
      };

      this.$refs.localVideo.srcObject = this.localStream;
      this.$refs.remoteVideo.srcObject = this.remoteStream;

      this.initIceCandidate();
    },

    async offerVideoCall() {
      await this.initConnection();

      // create offer
      const offerDescription = await this.pc.createOffer();
      await this.pc.setLocalDescription(offerDescription)

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
        chatId: this.id
      };

      this.$store.getters.stompClient.send("/app/ws/signaling/offer", JSON.stringify(offer));
    },

    async leave() {
      await this.localStream.getTracks().forEach(track => track.stop())
      await this.remoteStream.getTracks().forEach(track => track.stop())
      this.pc = null;
      this.localStream = null;
      this.remoteStream = null;
      this.$refs.localVideo.srcObject = null;
      this.$refs.remoteVideo.srcObject = null;
      await this.$router.push("/chat/" + this.id);
    }
  }
}
</script>