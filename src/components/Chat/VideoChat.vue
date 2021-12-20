<template>

    <div>
        <v-card flat>
            <v-card flat>
                <v-card-title class="justify-center">
                    <video controls autoplay playsinline ref="myVideo" :height="160" :muted="true" :id=-1></video>
                </v-card-title>
            </v-card>
            <v-card flat>
                <v-card-title class="justify-center">
                    <video controls autoplay playsinline ref="otherVideo" :height="160" :muted="true" :id="id"></video>
                </v-card-title>
            </v-card>
            <v-card flat>
                <v-card-title class="justify-center">
                    <v-btn v-on:click="join()">
                        <v-icon>mdi-video</v-icon>
                    </v-btn>
                </v-card-title>
            </v-card>
        </v-card>
    </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    props: [
      'id'
    ],
    methods: {
      supportsUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      },

      join() {
        if (!this.supportsUserMedia()) {
          alert("Browser does not support video");
        }
        let constraints = {
          video: true,
          audio: false
        };
        navigator.mediaDevices.getUserMedia(constraints).then((localStream) => {
          this.$refs.myVideo.srcObject = localStream
        });
      }
    }
  }
</script>