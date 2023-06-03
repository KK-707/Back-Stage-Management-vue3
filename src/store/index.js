import { createStore } from "vuex";
import Cookie from "js-Cookie";

export default createStore({
  state: {
    isCollapse: true,
    currentMenu: null,
    tabsList: [
      {
        path: "/",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
    menu: [],
    token: "",
  },
  mutations: {
    // 折叠侧边栏
    updateIsCollapse(state, payload) {
      state.isCollapse = !state.isCollapse;
    },
    // 菜单选择
    selectMenu(state, val) {
      // 判断
      // val.name == "home"
      //   ? (state.currentMenu = null)
      //   : (state.currentMenu = val);
      if (val.name == "home") {
        state.currentMenu = null;
      } else {
        state.currentMenu = val;
        // tag相关逻辑
        let result = state.tabsList.findIndex((item) => item.name === val.name);
        result == -1 ? state.tabsList.push(val) : "";
      }
    },
    // 删除tag
    closeTab(state, val) {
      let res = state.tabsList.findIndex((item) => item.name === val.name);
      state.tabsList.splice(res, 1);
    },
    // 菜单展示
    setMenu(state, val) {
      state.menu = val; // val传给menu（原来为空）
      localStorage.setItem("menu", JSON.stringify(val)); // 数据持久化
    },
    // 菜单持久化以及动态添加路由
    addMenu(state, router) {
      if (!localStorage.getItem("menu")) {
        return;
      }
      const menu = JSON.parse(localStorage.getItem("menu"));
      state.menu = menu;

      const menuArray = [];

      menu.forEach((item) => {
        if (item.children) {
          item.children = item.children.map((item) => {
            let url = `../views/${item.url}.vue`;
            item.component = () => import(/* @vite-ignore */ url);
            return item;
          });
          menuArray.push(...item.children);
        } else {
          let url = `../views/${item.url}.vue`;
          item.component = () => import(/* @vite-ignore */ url);
          menuArray.push(item);
        }
      });
      menuArray.forEach((item) => {
        router.addRoute("home1", item); // 与mockjs模拟数据的name名为home重复，故改为home1
      });
    },
    // 清除菜单
    clearMenu(state) {
      state.menu = [];
      localStorage.removeItem("menu");
    },
    // token设置
    setToken(state, val) {
      state.token = val;
      Cookie.set("token", val);
    },
    // token清除
    clearToken(state) {
      state.token = "";
      Cookie.remove("token");
    },
    // token获取
    getToken(state) {
      state.token = state.token || Cookie.get("token");
    },
  },
});
