import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { loadableReady } from '@loadable/component'
import { ApolloClient, InMemoryCache, ApolloProvider, NormalizedCacheObject } from '@apollo/client'

declare global {
  interface Window {
    __APOLLO_STATE__: NormalizedCacheObject;
  }
}

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
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