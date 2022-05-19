/**
 * 公共配置
 */
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const NodeExternals = require("webpack-node-externals");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");

module.exports = merge(baseConfig, {
  // 将entry指向应用程序的 server entry 文件
  entry: "./src/entry-server.js",
  // 允许 webpack 以 Node 适用方式处理模块加载，编译VUE组件时，告知 vue-loader 输送面向服务器的代码（server-orientd code）
  target: "node",
  output: {
    filename: "server-bundle.js",
    // 此处告知 server bundle 使用 node 风格导出模块
    libraryTarget: "commonjs2",
    publicPath: '/dist/',
  },
  // 不打包 node_modules 第三方包，保留 require方式直接加载
  externals: [
    NodeExternals({
      // 白名单中的资源依然正常打包
      allowlist: [/\.css$/],
    }),
  ],
  plugins: [
    // 将服务器的整个输出构建为单个 json文件的插件
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin(),
  ],
});
