import Koa from 'koa'
import mount from 'koa-mount'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ChunkExtractor } from '@loadable/server'
import path from 'path'

import App from './App'

const PORT = process.env.port || 3000;

const app = new Koa()

const webStats = path.resolve(
  __dirname,
  '../../dist/client/loadable-stats.json',
)

app.use(mount('/dist', require('koa-static')('dist/client')));

app.use(ctx => {
  const context: {
    url?: string
  } = {}
  
  const webExtractor = new ChunkExtractor({ statsFile: webStats })
  const jsx = webExtractor.collectChunks(
    <StaticRouter location={ctx.req.url} context={context}>
      <App />
    </StaticRouter>
  )

  const content = renderToString(jsx)
  
  const helmet = Helmet.renderStatic()

  const html = `
      <!doctype html>
      <html ${helmet.htmlAttributes.toString()}>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            ${webExtractor.getLinkTags()}
            ${webExtractor.getStyleTags()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${content}</div>
          ${webExtractor.getScriptTags()}
        </body>
    </html>
  `
  ctx.set('Content-Type', 'text/html')
  ctx.body = html;
})

app.listen(PORT);

console.log(`Server Up!\nhttp://localhost:${PORT}/`)