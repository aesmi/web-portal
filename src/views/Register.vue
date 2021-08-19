<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm9 md5>
        <v-card class="elevation-12" rounded="xl">
          <v-toolbar dark>
            <v-flex
              ><v-toolbar-title> {{ currentTitle }}</v-toolbar-title></v-flex
            >
          </v-toolbar>
          <v-card-text
            ><v-img
              src="../assets/pikachupeeker.png"
              position="center"
              max-width="450px"
              contain="true"
            ></v-img>
            <v-form ref="form" @submit.prevent="register">
              <v-window v-model="step" :show-arrows="showArrows"
                ><v-window-item :value="1">
                  <!--Enter username  -->
                  <v-text-field
                    v-model="username"
                    name="name"
                    label="Username"
                    placeholder="Please enter your desired username"
                    required
                    autofocus
                /></v-window-item>
                <!--Enter password confirmation-->
                <v-window-item :value="2">
                  <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    name="password"
                    label="Password"
                    :type="show1 ? 'text' : 'password'"
                    placeholder="Please enter your desired password"
                    :rules="passwordRules"
                    required
                    @click:append="show1 = !show1"
                  />
                  <v-text-field
                    v-model="password_confirmation"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    name="Confirm password"
                    label="Confirm password"
                    :type="show1 ? 'text' : 'password'"
                    placeholder="Please re-enter your password"
                    :rules="passwordRules"
                    required
                    @click:append="show1 = !show1"
                    @keyup.enter="register"
                  />
                  <v-btn @click="register">Register</v-btn>
                </v-window-item>
                <v-window-item :value="3">
                  <v-card-text>
                    I hope you read the TOS!
                  </v-card-text>
                </v-window-item>
              </v-window>
              <v-card-actions>
                <v-btn :disabled="step === 1" text @click="step--">
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="step === 3"
                  color="primary"
                  depressed
                  @click="step++"
                >
                  Next
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      emailRules: [
        v => !!v || "E-mail is required",
        //regex to check email
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length >= 6 || "Password must be greater than 6 characters"
      ],
      show1: false,
      step: 1
    };
  },
  methods: {
    register() {
      axios
        .post("https://localhost:8080/register", {
          data: {
            name: this.name,
            username: this.username,
            password: this.password
          }
        })
        .then(res => {
          //const access_token = res.data.access_token;
          //const expires_in = res.data.expires_in;
          const { access_token: accessToken, expires_in: expiresIn } = res.data;
          this.$store.commit("auth_success", {
            accessToken,
            expiresIn,
            username: this.username
          });
          this.$store.dispatch("login");
        })
        .catch(err => {
          this.$store.commit("auth_error");
          console.error(err);
        });
    }
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Choose an username";
        case 2:
          return "Create a password";
        default:
          return "Create account";
      }
    }
  }
};
</script>
