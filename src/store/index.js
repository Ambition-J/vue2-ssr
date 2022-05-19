import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

export default () => {
  return new Vuex.Store({
    state: () => ({
      posts: [],
    }),
    mutations: {
      setPosts(state, payload) {
        state.posts = payload;
      },
    },
    actions: {
      // 服务端渲染期间需要返回一个promise, 须要在渲染之前等待promise完成，也就是数据获取完成
      async getPosts({ commit }) {
        const { data } = await axios.get("https://cnodejs.org/api/v1/topics");
        commit("setPosts", data.data);
      },
    },
  });
};
