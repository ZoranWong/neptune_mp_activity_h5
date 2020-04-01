import App from '../src/App';
import Koa from 'koa';
import React from 'react';
import Router from 'koa-router';
import fs from 'fs';
import koaStatic from 'koa-static';
import path from 'path';
import { renderToString } from 'react-dom/server';

let render = require('koa-views-render');
// 配置文件
const config = {
  hostName : 'activity.node',
  port: 8091
};

// 实例化 koa
const app = new Koa();

// 静态资源
app.use(
  koaStatic(path.join(__dirname, '../build'), {
    maxage: 365 * 24 * 60 * 1000,
    index: 'root' 
    // 这里配置不要写成'index'就可以了，因为在访问localhost:3030时，不能让服务默认去加载index.html文件，这里很容易掉进坑。
  })
);

app.use( async (ctx, next) => {
    console.log(ctx.query, '=====================');
    // app.use(render('activity', {data: ctx.query}));
    await next();
});


// 设置路由
app.use(
  new Router()
    .get('*', async (ctx, next) => {
      ctx.response.type = 'html'; //指定content type
      let shtml = '';
      await new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../build/index.html'), 'utf-8', function(err, data) {
          if (err) {
            reject();
            return console.log(err);
          }
          shtml = data;
          resolve();
        });
      });
      // 替换掉 {{root}} 为我们生成后的HTML
      ctx.response.body = shtml.replace('{{root}}', renderToString(<App />));
      await next()
    })
    .routes()
);


app.listen(config.port, config.hostName, function() {
  console.log(`xxx://${config.hostName}:${config.port}`);
});
