/**
 * # Client
 *
 *
 */

import './utilities/adapter'

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'

import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

import { composeStore } from './redux/store'
import Routes from './routes'

const store = composeStore(browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

var components = (
  <Router history={history} routes={Routes}/>
)

if (__DEVELOPMENT__ && !window.devToolsExtension) {
  // window.React = React
  const DevTools = require('./redux/DevTools')
  components = (
    <div>
      {components}
      <DevTools/>
    </div>
  )
  console.warn('[DEBUG] Enabled Redux-DevTools')
}

render(
  <Provider store={store}>
    {components}
  </Provider>,
  document.getElementById('root')
)
