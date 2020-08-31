import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/index",
        name: "Index",
        component: () => import("@/components/index.vue")
      },
      {
        path: "/manager",
        name: "Manager",
        component: () => import("@/components/manager.vue")
      },
      {
        path: "/history",
        name: "History",
        component: () => import("@/components/history.vue")
      },
      {
        path: "/chat",
        name: "Chat",
        component: () => import("@/components/chat.vue")
      },
      {
        path: "/personal",
        name: "Personal",
        component: () => import("@/components/personal.vue")
      },
      {
        path: "/map",
        name: "Map",
        component: () => import("@/components/map.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/login.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
