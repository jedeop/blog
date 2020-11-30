import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'

import Home from './Home'
import About from './About'

const App = () => (
  <>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>

    <Switch>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </>
)

export default App