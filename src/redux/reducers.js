/**
 * # Reducers
 *
 * Merge multiple reducer
 */

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import instancesReducer from './modules/instances'
import connectionReducer from './modules/connection'
import requestReducer from './modules/request'
import responseReducer from './modules/response'
import socketReducer from './modules/socket'

export default combineReducers({
  routing: routerReducer,

  instances: instancesReducer,
  connection: connectionReducer,
  request: requestReducer,
  response: responseReducer,
  socket: socketReducer
})
