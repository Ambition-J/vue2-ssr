const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

const resolve = (file) => path.resolve(__dirname, file);

module.exports = (server, cb) => {
  let ready;
  const onReady = new Promise((r) => (ready = r));
  let template;
  let serverBundle;
  let clientManifest;
  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready();
      cb(serverBundle, template, clientManifest);
    }
  };
  // 监视构建  template && serverBundle && clientManifest ===> 调用 update ===> 更新Renderer渲染器
  const templatePath = path.resolve(__dirname, "../index.template.html");
  template = fs.readFileSync(templatePath, "utf-8");
  update();
  // fs.watch 、fs.watchFile
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    update();
  });

  // serverBundle 打包并监视

  const serverConfig = require("./webpack.server.config");
  const serverCompiler = webpack(serverConfig);
  const serverDevMiddleware = devMiddleware(serverCompiler);
  serverCompiler.hooks.done.tap("server", () => {
    serverBundle = JSON.parse(
      serverDevMiddleware.context.outputFileSystem.readFileSync(
        resolve("../dist/vue-ssr-server-bundle.json"),
        "utf-8"
      )
    );
    update();
  });

  // 默认的构建结果是输出到磁盘中的，如果频繁操作磁盘，效率很低 开销很大。
  // serverCompiler.watch({}, (err, stats) => {
  // if (err) throw err;
  // if (stats.hasErrors()) return;
  // serverBundle = JSON.parse(
  //   fs.readFileSync(resolve("../dist/vue-ssr-server-bundle.json"), "utf-8")
  // );
  // update();
  //   console.log('success');
  // });

  // clientManifest 打包并监视
  const clientConfig = require("./webpack.client.config");
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  const entry = clientConfig.entry.app;
  clientConfig.entry.app = [
    "webpack-hot-middleware/client?path=/__webpack_hmr&quiet=true&reload=true", // 和服务端交互处理热更新一个客户端脚本
    entry,
  ];
  clientConfig.output.filename = "[name].js"; // 热更新模式下确保一致的 hash

  const clientCompiler = webpack(clientConfig);
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
  });
  clientCompiler.hooks.done.tap("client", () => {
    clientManifest = JSON.parse(
      clientDevMiddleware.context.outputFileSystem.readFileSync(
        resolve("../dist/vue-ssr-client-manifest.json"),
        "utf-8"
      )
    );
    update();
  });
  server.use(
    hotMiddleware(clientCompiler, {
      log: false, // 关闭日志输出
    })
  );
  // 重要！！！将 clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddleware);
  return onReady;
};
