import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || "",
    isLogin: false,
    refreshToken: ""
  },
  mutations: {
    set_auth(state, options) {
      state.token = options.token;

      state.isLogin = options.isLogin;

      state.expiresIn = options.expiresIn;
      state.refreshToken = options.refreshToken;
    },
    remove_auth(state) {
      (state.token = ""),
        (state.isLogin = false),
        (state.expiresIn = ""),
        (state.refreshToken = "");
    }
  },
  actions: {
    setAuth(context, options) {
      context.commit("set_auth", {
        token: options.token,
        isLogin: options.isLogin,
        expiresIn: options.expiresIn,
        refreshToken: options.refreshToken
      });
    },
    Logout({ commit }) {
      commit("remove_auth");
    }
  },
  getters: {
    isLogin: state => !!state.isLogin
  }
};
