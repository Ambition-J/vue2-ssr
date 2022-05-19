<template>
  <div>
    <h1>Post List</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Post",
  metaInfo: {
    title: "数据获取",
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["posts"]),
  },
  methods: {
    ...mapActions(["getPosts"]),
  },
  // vue ssr 特殊为服务端渲染提供的生命周期钩子
  serverPrefetch() {
    // 发起 action ，返回promise
    return this.getPosts();
  },
};
</script>

<style>
</style>