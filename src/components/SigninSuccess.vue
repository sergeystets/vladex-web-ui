<template>
  <v-container style="height: 400px;">
    <v-row
        class="fill-height"
        align-content="center"
        justify="center"
    >
      <v-col
          class="subtitle-1 text-center"
          cols="12"
      >
        Sing-in success, redirecting to home page...
      </v-col>
      <v-col cols="6">
        <v-progress-linear
            indeterminate
            rounded
            height="6"
        ></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  mounted() {
    this.$store.dispatch('singInSuccess')
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  watch: {
    user(user) {
      if (user) {
        this.$router.push('/chat/' + user.chatIdToLoad)
      }
    }
  }
}
</script>
