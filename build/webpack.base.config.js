/**
 * 公共配置
 */
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const resolve = (file) => path.resolve(__dirname, file);

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  output: {
    path: resolve("../dist"),
    publicPath: "/dist/",
    filename: "[name].[chunkhash].js",
  },
  resolve: {
    // 路径别名，@ 指向src
    alias: {
      "@": resolve("../src/"),
    },
    // 可省略扩展名，按照从前往后的顺序解析
    extensions: [".js", ".vue", ".json"],
  },
  devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.(png|jpeg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: ["file-loader"],
      },
      {
        test: /\.vue$/i,
        use: ["vue-loader"],
      },
      {
        test: /\.css$/i,
        // 处理 css文件以及 .vue文件中的<style> 块
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin(), new FriendlyErrorsWebpackPlugin()],
};
