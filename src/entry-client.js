/**
 * 客户端入口
 */
import { createApp } from "./app";
// 客户端特定引导逻辑
const { app, router, store } = createApp();
// 如果浏览器上有服务端传过来的state数据，就把容器内的数据替换成服务端发送过来的
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}
router.onReady(() => {
  app.$mount("#app");
});
