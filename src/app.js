/**
 * 通用启动入口
 */
import Vue from "vue";
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";
import VueMeta from "vue-meta";
Vue.use(VueMeta);
Vue.mixin({
  metaInfo: {
    titleTemplate: "%s - 天气不错",
    meta: [
      {
        name: "description",
        content: "天气不错",
      },
    ],
  },
});
// 导出一个工厂函数，用户创建新的应用程序、router 以及 store实例
export function createApp() {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });
  return { app, router, store };
}
