// auth api

import req from "./http.js";
import axios from "axios";
// import store from "@/store";

var mobileApi = axios.create({
  baseURL: "https://hkhc-uat.clinic1.one/api/services/app/mobile/login"
});

const auth = {
  //Login (Token)
  apiGetLogin(body) {
    return req("post", "", body);
  },
  //Required for Login
  //register in the server
  mobileAuth(body, headers) {
    return mobileApi.post("", body, { headers });
  }
};

export default auth;
