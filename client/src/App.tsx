import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'

const Home = loadable(() => import('./Home'))
const About = loadable(() => import('./About'))

const App = () => (
  <div>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>

    <Switch>
      <Route path="/about" render={() => <About />} />
      <Route path="/" render={() => <Home />} />
    </Switch>
  </div>
)

export default App