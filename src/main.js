import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";
import "./assets/styles/common.scss";
import http from "@/assets/js/http.js";

Vue.prototype.$http = http;
Vue.config.productionTip = false;
Vue.use(ElementUI, { size: "small", zIndex: 1000 });

router.beforeEach((to, from, next) => {
  //全局路由守卫
  if (to.path === "/login") {
    next();
  } else {
    let token = sessionStorage.getItem("sessionId");
    if (token === null || token === "") {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
