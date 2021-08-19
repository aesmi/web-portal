import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

import auth from "./modules/auth";
// import snackbar from "./modules/snackbar";

Vue.use(Vuex);

export default new Vuex.Store({
  //only putting tokens in store, user credentials are handled at a component level
  modules: {
    auth
  },
  //auth module registers into vuex
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer(val) {
        return {
          //store specific module
          auth: val.auth
        };
      }
    })
  ],

  state: {
    status: "",
    token: "",
    refresh_token: "",
    expiration: "",
    authenticated: false,
    username: "",
    avatar: ""
  },
  mutations: {
    //basically our methods
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, { accessToken, expiresIn, username }) {
      state.status = "success";
      state.expiration = expiresIn;
      state.token = accessToken;
      state.authenticated = true;
      state.username = username;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      //resets state's status and token to empty
      state.status = "";
      state.token = "";
      state.refresh_token = "";
      state.expiration = "";
      state.authenticated = false;
      state.username = "";
    },
    fetchAvatar(state, { avatar }) {
      state.avatar = avatar;
    },
    refreshToken() {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: "https://identityuat.clinic1.one/connect/token"
        })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  },
  actions: {
    logout({ commit }) {
      //calls logout mutation to change global state
      commit("logout");
    }
  },
  getters: {
    userName: state => state.username,
    refToken: state => state.refresh_token,
    isLoggedIn: state => !!state.authenticated, //using double !! to change state.token from truthy to true when it is returned
    authStatus: state => state.status //returns auth's status
  }
});
