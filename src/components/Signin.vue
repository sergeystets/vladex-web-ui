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
        {{ $t('text.redirecting.to.sign-in.page') }}
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
    this.$store.dispatch('signIn')
  },
}
</script>
