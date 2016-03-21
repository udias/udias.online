/**
 * # Store
 *
 * Create custom store
 */

import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'

import reducers from './reducers'

export function composeStore (history) {

  const middleware = [
    routerMiddleware(history)
  ]

  var finalCreateStore = null
  if (__DEVELOPMENT__) {
    const { persistState } = require('redux-devtools')
    const DevTools = require('./DevTools')
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore)
  }

  const store = finalCreateStore(reducers)

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'))
    })
  }

  return store
}
