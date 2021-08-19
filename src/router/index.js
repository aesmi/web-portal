//dependencies
import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index.js";
//views
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import HeartRate from "@/views/HeartRate.vue";
import ECG from "@/views/ECG.vue";
import Sleep from "@/views/Sleep.vue";
import Steps from "@/views/Steps.vue";
import BloodGlucose from "@/views/BloodGlucose.vue";
import BloodPressure from "@/views/BloodPressure.vue";
import Coronavirus from "@/components/Coronavirus.vue";
import Login from "@/views/Login.vue";
import Logout from "@/views/Logout.vue";
import Register from "@/views/Register.vue";
import Secure from "@/views/Secure.vue";
import HKHC from "@/views/HKHC.vue";
//import Profile from "@/components/Profile.vue";
//components

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout
  },
  {
    path: "/secure",
    name: "Secure",
    component: Secure
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/report",
    name: "Report",
    component: HKHC,
    meta: { requiresAuth: true }
  },
  {
    path: "/heartrate",
    name: "Heart Rate",
    component: HeartRate,
    meta: { requiresAuth: true }
  },
  {
    path: "/ecg",
    name: "ECG",
    component: ECG,
    meta: { requiresAuth: true }
  },
  {
    path: "/sleep",
    name: "Sleep",
    component: Sleep,
    meta: { requiresAuth: true }
  },
  {
    path: "/steps",
    name: "Steps",
    component: Steps,
    meta: { requiresAuth: true }
  },
  {
    path: "/bloodglucose",
    name: "bloodglucose",
    component: BloodGlucose,
    meta: { requiresAuth: true }
  },
  {
    path: "/bloodpressure",
    name: "bloodpressure",
    component: BloodPressure,
    meta: { requiresAuth: true }
  },
  {
    path: "/coronavirus",
    name: "coronavirus",
    component: Coronavirus,
    meta: { requiresAuth: true }
  },
  {
    path: "/*",
    redirect: "Home"
  }
];
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new Router({
  routes
});
// check for unauthorized access
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth.isLogin) {
      if (from.name == "Secure") {
        next(false);
      } else {
        next({
          name: "Secure"
        });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
