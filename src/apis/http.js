//set interceptor
import axios from "axios";
import store from "../store";
import router from "@/router";
import auth from "./auth.js";
// import router from "../router";

var loginApi = axios.create({
  baseURL: "https://identityuat.clinic1.one/connect/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

//non finish, finish login first

var componentApi = axios.create({
  baseURL: "https://hkhc-uat.clinic1.one/api/services/app/healthManager",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json"
  }
});

var refreshApi = axios.create({
  baseURL: "https://identityuat.clinic1.one/connect/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Bearer " + localStorage.getItem("token")
  }
});

// Request intercepter(loginApi)
componentApi.interceptors.request.use(
  config => {
    // Before send a request,checking the token whether exists or not
    // If it exists, http header will be added the token
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = "Bearer " + token);

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response intercepter(loginApi)
componentApi.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 && !originalRequest._retry) ||
      error.response.status === 403
    ) {
      originalRequest._retry = true;

      var qs = require("qs");

      refreshApi
        .post(
          "",
          qs.stringify({
            client_id: "client.web.portal",
            grant_type: "refresh_token",
            refresh_token: localStorage.getItem("refresh_token")
          })
        )

        .then(res => {
          if (res.status == 200) {
            localStorage.removeItem("refresh_token");

            let token = res.data.access_token;
            let expiresIn = res.data.expires_in;
            let refreshToken = res.data.refresh_token;
            // 1) put token to LocalStorage
            localStorage.setItem("token", token);
            localStorage.setItem("refresh_token", refreshToken),
              localStorage.setItem("expires_in", expiresIn);
            // 2) Change Authorization header
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorage.getItem(token);

            store.dispatch("auth/setAuth", {
              token: token,
              isLogin: true,
              expiresIn: expiresIn,
              refreshToken: refreshToken
            });
            auth.mobileAuth(
              {
                deviceId: "string",
                updateDeviceId: true
              },
              {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            );

            location.reload();
          }
        })
        //If refresh token fail, login again
        .catch(() => {
          store.dispatch("auth/setAuth", {
            token: "",
            isLogin: false,
            expiresIn: "",
            refreshToken: ""
          }),
            router.push("/secure"),
            Promise.reject(error);
        });
    }
  }
);

export default function(method, url, data = null) {
  method = method.toLowerCase();
  if (method == "post") {
    return loginApi.post(url, data);
  } else if (method == "get") {
    return componentApi.get(url, { params: data });
  } else {
    console.error("Unknown" + method);
    return false;
  }
}
