import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";

import "./assets/less/index.less";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from "./store";
import "./api/mock.js";
import api from "./api/api";

const app = createApp(App);
// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// app.use(ElementPlus);
app.config.globalProperties.$api = api;
store.commit("addMenu", router);
function checkRouter(path) {
  let hasCheck = router
    .getRoutes() // router.getRoutes() 方法获取所有已定义的路由
    .filter((route) => route.path == path).length; // filter 方法筛选出与给定路径匹配的路由
  if (hasCheck) {
    return true;
  } else {
    return false;
  }
  // console.log(router.getRoutes);
}
// 路由守卫
router.beforeEach((to, from, next) => {
  store.commit("getToken");
  const token = store.state.token;
  if (!token && to.name !== "login") {
    // 当没有token且路径非login时跳转到login
    next({ name: "login" });
  } else if (!checkRouter(to.path)) {
    // 当目标路由不在允许的路由列表中，则跳转到home
    next({ name: "home" });
  } else {
    next();
  }
});

app.use(router).use(store);
app.mount("#app");
