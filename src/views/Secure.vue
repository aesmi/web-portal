<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm9 md5>
        <v-card class="elevation-12 .rounded-xl" @click="refresh()" to="/login">
          <v-card-title>
            <h1>Please me to login in to access this page</h1>
          </v-card-title>
          <br />
          <v-img
            position="center"
            max-width="300"
            src="@/assets/bye.png"
          ></v-img> </v-card></v-flex></v-layout
  ></v-container>
</template>
<script>
export default {
  isLoggedIn: function() {
    return this.$store.getters.isLoggedIn;
  },
  methods: {
    refresh() {
      location.reload();
    }
  }
};
</script>
