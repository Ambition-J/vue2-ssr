/**
 * 公共配置
 */
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(baseConfig, {
  entry: {
    app: "./src/entry-client.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true,
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
  // 将webpack 运行时分离到一个引导chunk 中，可以在之后异步注入chunk
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity,
    },
    minimize: true, // 配套使用，开启之后表示要使用 minimizer 里面的插件处理代码
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    // 插件输出目录中生成 `vue-ssr-client-manifest.json`
    new VueSSRClientPlugin(),
  ],
});
