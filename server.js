const Vue = require("vue");
const fs = require("fs");
const { createBundleRenderer } = require("vue-server-renderer");
const express = require("express");
const setupDevServer = require("./build/setup-dev-server");

const server = express();

server.use("/dist", express.static("./dist"));
const isProd = process.env.NODE_ENV === "production";

let renderer;
let onReady; // 用来监控是否构建完成
if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const template = fs.readFileSync("./index.template.html").toString();
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  // renderer 会把解析好的html字符串插入到 模版文件的 <!--vue-ssr-outlet--> 位置进行替换
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  });
} else {
  // 开发模式 ===> 监视变化，打包构建 ===>生成新的 renderer 渲染器
  // 通过回掉函数传参数的方式，获取新打包之后的 serverBundle ,template ,clientMainfest
  // setupDevServer 需要返回一个promise 表示更新的状态 失败还是成功， 用 onReady 接收
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest,
    });
  });
}

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      url: req.url,
    });
    res.end(html);
  } catch (err) {
    console.log(err);
    return res.status(500).end("Internal Server Error");
  }
};
server.get(
  "*",
  isProd
    ? render
    : async (req, res) => {
        // TODO: 等待有了 renderer 渲染器之后，调用 render进行渲染
        await onReady;
        render(req, res);
      }
);

server.listen(3000, () => {
  console.log("server running at port 3000");
});
