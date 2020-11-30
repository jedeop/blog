import Koa from 'koa'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import App from './App'

const PORT = process.env.port || 1234;

const app = new Koa()

app.use(require('koa-static')('dist'));

app.use(ctx => {
  const context: {
    url?: string
  } = {}
  const content = renderToString(
    <StaticRouter location={ctx.req.url} context={context}>
      <App />
    </StaticRouter>
  )

  if (context.url) {
    ctx.redirect(context.url);
  } else {
    const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Basic SSR</title>
</head>
<body>
  <div id="root">
    ${content}
  </div>
  <script src="./index.js"></script>
</body>
</html>
  `
    ctx.body = html;
  }
})

app.listen(PORT);

console.log(`Server Up!\nhttp://localhost:${PORT}/`)