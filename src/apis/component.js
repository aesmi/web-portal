import req from "./http.js";
import axios from "axios";
import store from "@/store";
import auth from "./auth";
import router from "@/router";
//Define api
const component = {
  apiGetStep(params) {
    return req("get", "/GetStepRecordRangeList?", params);
  },
  apiGetHeartRate(params) {
    return req("get", "/GetHeartRateRecordRangeList?", params);
  },
  apiGetSleep(params) {
    return req("get", "/GetSleepRecordRangeList?", params);
  },

  apiGetBloodPressureRecordRangeList({ params }) {
    return req("get", "/GetBloodPressureRecordRangeList?", { params });
  },
  apiGetECGList(params) {
    return req("get", "/GetECGList?", params);
  },
  apiGetECGrRecordRangeList({ params }) {
    return req("get", "/GetECGRecordRangeList?", { params });
  },

  apiGetBloodGlucoseRecordRangeList(params) {
    return req("get", "/GetBloodGlucoseRecordRangeList?", params);
  },
  apiGetRecordPlan(headers) {
    return apiHealthRecord.get("/GetRecordPlan", { headers });
  },
  apiGetRecordList(config) {
    return apiHealthRecord.get("/GetRecordList?", config);
  }
};

export default component;

//For HKHC Report
var refreshApi = axios.create({
  baseURL: "https://identityuat.clinic1.one/connect/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Bearer " + localStorage.getItem("token")
  }
});
var apiHealthRecord = axios.create({
  baseURL: "https://hkhc-uat.clinic1.one/api/services/app/healthRecord"
});
apiHealthRecord.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (error.response.status === 401 || error.response.status === 403) {
      // if (error.response.status === 401   ) {
      // originalRequest._retry = true;

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

            store
              .dispatch("auth/setAuth", {
                token: token,
                isLogin: true,
                expiresIn: expiresIn,
                refreshToken: refreshToken
              })
              .then(() => {
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
                // });
                location.reload();

                // 3) return originalRequest object with.
              });
          }
          // If refresh token fail, login again
        })
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

//cannot take new access token, require user login again
