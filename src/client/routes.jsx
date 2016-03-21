/**
 * # Routes
 *
 *
 */

import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './page/App'
import Home from './containers/Home/Home'
import Suppliant from './containers/Suppliant/Suppliant'
import Patron from './containers/Patron/Patron'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/suppliant(/:name)" component={Suppliant}/>
    <Route path="/patron(/:hash)" component={Patron}/>
    <Redirect from="*" to="/"/>
  </Route>
)
