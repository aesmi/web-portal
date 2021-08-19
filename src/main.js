//import dependencies and components
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import vuetify from "@/plugins/vuetify";
import VCharts from "v-charts";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.css";
import "./plugins/chartist";
import "./plugins/base";
import _ from "lodash";
import api from "./apis";

Vue.prototype.$api = api;
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}
import loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
//import VeeValidate from "vee-validate";
//  import jwt from 'jsonwebtoken';

//extend Vue prototype methods with axios
Vue.prototype.$http = axios;
Vue.prototype.$_ = _;
// const token = localStorage.getItem("token");
// if (token) {
//   Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
// }

Vue.config.productionTip = false;
Vue.use(VCharts);
Vue.use(VueMaterial);

Vue.component("loading", loading);
//Vue.use(VeeValidate);

// let isRefreshing = false;

// axios.interceptors.res.use(
//   (res) => {
//     return res;
//   },
//   (err) => {
//     const {
//       config,
//       res: { error },
//     } = err;

//     const originalRequest = config;

//     if (error.code === 401 && error.message === "Expired Token") {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         store
//           .dispatch("refreshToken")
//           .then(({ status }) => {
//             if (status === 200 || status === 204) {
//               isRefreshing = false;
//             }
//           })
//           .catch((err) => {
//             console.error(err);
//           });
//       }
//     }
//   }
// );

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

// this.$api.auth
//   .login({
//     account: this.loginForm.account,
//     password: this.loginForm.password
//   })
//   .then(response => {
//     let res = response.data;
//     let token = res.result.token;

//     this.$store.dispatch("auth/setAuth", {
//       token: token,
//       isLogin: true
//     });
//     this.loginForm = { account: "", password: "" };
//     this.$router.push("/home");
//   });
