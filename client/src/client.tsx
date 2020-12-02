import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { loadableReady } from '@loadable/component'

loadableReady(() => {
  ReactDOM.hydrate((
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ), document.getElementById('root'))
})