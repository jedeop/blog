import Koa from 'koa'
import mount from 'koa-mount'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { StaticRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ChunkExtractor } from '@loadable/server'
import path from 'path'
import fetch from 'cross-fetch'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { getDataFromTree } from '@apollo/react-ssr'

import App from './App'

const PORT = process.env.port || 3000;

const app = new Koa()

const webStats = path.resolve(
  __dirname,
  '../../dist/client/loadable-stats.json',
)

app.use(mount('/dist', require('koa-static')('dist/client')));

app.use(async ctx => {
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'http://localhost:8888/graphql',
      credentials: 'same-origin',
      headers: {
        cookie: ctx.get('Cookie'),
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  })
  const context: {
    url?: string
  } = {}

  const webExtractor = new ChunkExtractor({ statsFile: webStats })
  const sheet = new ServerStyleSheet()

  const jsx = webExtractor.collectChunks(
      <ApolloProvider client={client}>
        <StaticRouter location={ctx.req.url} context={context}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    )

  await getDataFromTree(jsx)

  const content = renderToString(sheet.collectStyles(jsx))

  const initialState = client.extract()
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
            ${sheet.getStyleTags()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${content}</div>
          <script type="text/javascript">window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')};</script>
          ${webExtractor.getScriptTags()}
        </body>
    </html>
  `
  ctx.set('Content-Type', 'text/html')
  ctx.body = html;
})

app.listen(PORT);

console.log(`Server Up!\nhttp://localhost:${PORT}/`)