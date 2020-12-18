import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { loadableReady } from '@loadable/component'
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import { ApolloCache } from './apollo'

declare global {
  interface Window {
    __APOLLO_STATE__: NormalizedCacheObject;
  }
}

const client = new ApolloClient({
  uri: '/graphql',
  cache: ApolloCache().restore(window.__APOLLO_STATE__),
  connectToDevTools: true,
})

loadableReady(() => {
  ReactDOM.hydrate((
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  ), document.getElementById('root'))
})