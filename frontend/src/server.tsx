import Koa from "koa";
import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { ChunkExtractor } from "@loadable/server";
import path from "path";
import fetch from "cross-fetch";
import { ApolloClient, ApolloProvider, createHttpLink } from "@apollo/client";
import { getDataFromTree } from "@apollo/react-ssr";

import App from "./App";
import { ApolloCache } from "./apollo";
import ScrollToTop from "./components/scrollToTop";

const app = new Koa();

const webStats = path.resolve(
  __dirname,
  "../../dist/client/loadable-stats.json",
);

app.use(async ctx => {
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: process.env.BACKEND_URL,
      credentials: "same-origin",
      headers: {
        cookie: ctx.get("Cookie"),
      },
      fetch,
    }),
    cache: ApolloCache(),
  });

  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const sheet = new ServerStyleSheet();

  const jsx = webExtractor.collectChunks(
    <ApolloProvider client={client}>
      <StaticRouter location={ctx.req.url || "/"}>
        <ScrollToTop />
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

  await getDataFromTree(jsx);

  const content = renderToString(sheet.collectStyles(jsx));

  const initialState = client.extract();
  const helmet = Helmet.renderStatic();

  const html = `
      <!doctype html>
      <html lang="ko" ${helmet.htmlAttributes.toString()}>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            ${webExtractor.getLinkTags()}
            ${sheet.getStyleTags()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${content}</div>
          <noscript>
            이 웹사이트를 사용하기 위해서는 JavaScript를 허용해야합니다.
          </noscript>
          <script>window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, "\\u003c")};</script>
          ${webExtractor.getScriptTags()}
        </body>
    </html>
  `;
  ctx.set("Content-Type", "text/html");
  ctx.body = html;
});

app.listen(3000);

console.log("Server Up!");