<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <h2>动态交互12222</h2>
    <div>
      <input v-model="message" />
    </div>
    <div>
      <button @click="onClick">点击测试</button>
    </div>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">about</router-link></li>
      <li><router-link to="/abc">404</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "今天天气不错",
    };
  },
  methods: {
    onClick() {
      console.log("点击。。。");
    },
  },
};
</script>

<style>
</style>