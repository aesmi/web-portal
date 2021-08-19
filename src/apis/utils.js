import { Message } from "element-ui";

//error message
export const tip = msg => {
  Message.error(msg);
};

export const toLogin = () => {
  this.$router.replace({
    name: "Login",
    query: {
      redirect: this.$router.currentRoute.fullPath
    }
  });
};

// 403 error page
export const to403Page = () => {
  this.$router.replace({
    name: "403"
  });
};
