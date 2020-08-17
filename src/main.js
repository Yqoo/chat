import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";
import axios from "axios";
import "./assets/styles/common.scss";
Vue.prototype.axios = axios;
axios.defaults.headers["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.withCredentials = true; //运行携带cookie
axios.defaults.baseURL = "http://192.168.0.102:8090";
axios.defaults.timeout = 50000;
Vue.config.productionTip = false;
Vue.use(ElementUI, { size: "small", zIndex: 1000 });
router.beforeEach((to, from, next) => {
  //全局路由守卫
  if (to.path === "/login") {
    next();
  } else {
    let token = localStorage.getItem("Token");
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
