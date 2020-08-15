import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "element-ui/lib/theme-chalk/index.css";
import { Button, Select } from "element-ui";
import axios from "axios";

Vue.prototype.axios = axios;
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.withCredentials = true; //运行携带cookie
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  //全局路由守卫
  if (to.path === "/login") {
    next();
  } else {
    let token = localStorage.getItem("loginToken");
    if (token === null || token === "") {
      next({ path: "/login" });
    } else {
      let obj = JSON.parse(token);
      if (new Date().getTime() - obj.time > 1000 * 60 * 60 * 24) {
        //过期时间为1天
        next({ path: "/login" });
      } else {
        next();
      }
    }
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
