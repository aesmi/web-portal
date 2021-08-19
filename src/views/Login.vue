<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm9 md5>
        <v-card class="elevation-12" rounded="xl">
          <v-toolbar dark>
            <v-flex justify-center>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-flex>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" class="login" @submit.prevent="login">
              <!--Enter username  -->
              <v-text-field
                v-model="username"
                name="username"
                label="Email Address"
                type="email"
                placeholder="Please enter your email"
                :autofocus="true"
                :rules="emailRules"
                required
              />
              <!-- Enter password -->
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                name="password"
                label="Password"
                :type="show1 ? 'text' : 'password'"
                placeholder="Please enter your password"
                :rules="passwordRules"
                required
                @click:append="show1 = !show1"
                @keyup.enter="login() + login2()"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-flex justify-center>
              <v-btn dark @click="login() + login2()">Login</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
//v-models: username, password
import axios from "axios";

var qs = require("qs");
export default {
  name: "Login",
  data() {
    return {
      valid: false,
      username: "",
      password: "",
      emailRules: [
        v => !!v || "E-mail is required",
        //regex to check email
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 6 || "Password must be greater than 6 characters"
      ],
      show1: false
    };
  },
  methods: {
    login2() {
      this.$api.auth
        .apiGetLogin(
          qs.stringify({
            scope: "openid email profile offline_access api",
            client_id: "client.web.portal",
            redirect_uri: "https://localhost:8080/sign-in",
            grant_type: "password",
            username: this.username,
            password: this.password
          })
        )
        .then(response => {
          let res = response.data;
          let token = res.access_token;
          let expiresIn = res.expires_in;
          let refreshToken = res.refresh_token;

          localStorage.setItem("token", token);

          localStorage.setItem("refresh_token", refreshToken);
          this.$store
            .dispatch("auth/setAuth", {
              token: token,
              isLogin: true,
              expiresIn: expiresIn,
              refreshToken: refreshToken
            })
            .then(() => {
              this.$api.auth.mobileAuth(
                {
                  deviceId: "string",
                  updateDeviceId: true
                },
                {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token")
                }
              );
              this.$router.push("/");
            });
        });
    },

    login() {
      axios({
        method: "post",
        url: "https://identityuat.clinic1.one/connect/token",
        //header for cors
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
          scope: "openid email profile offline_access api",
          client_id: "client.web.portal",
          redirect_uri: "https://localhost:8080/sign-in",
          grant_type: "password",
          username: this.username,
          password: this.password
        })
      })
        .then(res => {
          //assign variables using destructuring to extract data from json returned axios
          const { access_token: accessToken, expires_in: expiresIn } = res.data;
          this.$store.commit("auth_success", {
            accessToken,
            expiresIn,
            username: this.username
          });

          this.mobileAuth();
          this.$router.push("/");
        })
        .catch(() => {
          //calls the auth_error mutation
          this.$store.commit("auth_error");
        });
    }
  }
};
</script>
