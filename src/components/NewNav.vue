<template>
  <span>
    <v-app-bar dark ripple app clipped-left fluid class="elevation-12">
      <v-app-bar-nav-icon dark @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn fab class="white--text" color="grey-lighten-4" to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <template v-if="auth">
        <v-btn fab class="white--text" color="grey-lighten-4" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        <!--<LogoutPopup />-->
      </template>
      <template v-else
        ><v-btn fab class="white--text" color="grey-lighten-4" to="/Login"
          ><v-icon>mdi-login</v-icon>
        </v-btn></template
      >
      <v-btn fab class="white--text" color="grey-lighten-4" to="/Register">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="auth"
      class="elevation-12"
      v-model="drawer"
      dark
      ripple
      fluid
      app
      floating
      expand-on-hover
      mini-variant
      clipped
      float
      :mobile-breakpoint="-1"
    >
      <v-list nav dense class="py-0">
        <v-list-item two-line :class="'px-0'">
          <v-list-item-avatar> </v-list-item-avatar>

          <v-list-item-content>
            <span
              ><v-list-item-title>User: {{ user }}</v-list-item-title></span
            >
            <span
              ><v-list-item-title>Email: {{ getEmail }} </v-list-item-title>
            </span>
          </v-list-item-content>
        </v-list-item>

        <!--for directive to generate vue list elements-->
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="routeTo(item.url)"
        >
          <v-list-item-icon>
            <v-icon dark>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </span>
</template>

<script>
//import LogOutPopup from "./LogOutPopup";
import store from "@/store";
export default {
  name: "NewNav",
  //components: { LogOutPopup},
  data() {
    return {
      user: "mimikyu",
      userProfilePic:
        "https://vignette.wikia.nocookie.net/pkmnshuffle/images/4/41/Mimikyu.png/revision/latest?cb=20170409221435",
      drawer: true,
      items: [
        { title: "Home", icon: "mdi-view-dashboard", url: "/" },
        { title: "Report", icon: "mdi-file-chart", url: "/report" },
        { title: "Heart Rate", icon: "mdi-heart-pulse", url: "/heartrate" },
        { title: "ECG", icon: "mdi-image", url: "/ecg" },
        { title: "Sleep", icon: "mdi-sleep", url: "/sleep" },
        { title: "Step", icon: "mdi-run", url: "/steps" },
        { title: "Blood Glucose", icon: "mdi-water", url: "/bloodglucose" },
        {
          title: "Blood Pressure",
          icon: "mdi-hand-heart",
          url: "/bloodpressure"
        },
        { title: "Coronavirus Stats", icon: "mdi-virus", url: "/coronavirus" }
      ]
    };
  },
  methods: {
    logout() {
      //calls logout mutation to change global state

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      store.dispatch("auth/Logout");
      this.$router.push("/logout");
    },
    routeTo(url) {
      this.$router.push(url);
    }
  },
  computed: {
    getEmail() {
      return store.getters.userName;
    },
    auth() {
      return store.getters["auth/isLogin"];
    }
  }
};
</script>
