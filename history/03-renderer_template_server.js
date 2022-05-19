const Vue = require("vue");
const fs = require("fs");
const express = require("express");
// renderer 会把解析好的html字符串插入到 模版文件的 <!--vue-ssr-outlet--> 位置进行替换
const renderer = require("vue-server-renderer").createRenderer({
  template: fs.readFileSync("./index.template.html").toString(),
});

const server = express();

server.get("/", (req, res) => {
  const app = new Vue({
    template: `
              <div id="app">
                  <h1> {{message}} </h1>
              </div>
          `,
    data: {
      message: "今天天气不错",
    },
  });

  renderer.renderToString(
    app,
    {
      title: "天气不错",
      meta: `
         <meta name="description" content="天气不错">
        `,
    },
    (err, html) => {
      if (err) {
        return res.status(500).end("Internal Server Error");
      }
      res.end(html);
    }
  );
});

server.listen(3000, () => {
  console.log("server running at port 3000");
});
