/**
 * # Module: Instances
 *
 * Keep references to system wide available instances (e.g. for communication).
 */

const SET_SOCKET = '@udias/instances/SET_SOCKET'
const SET_PEER = '@udias/instances/SET_PEER'

export function setSocket (socket) {
  return {
    type: SET_SOCKET,
    socket
  }
}

export function setPeer (peer) {
  return {
    type: SET_PEER,
    peer
  }
}

const initialState = {
  socket: null,
  peer: null
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: action.socket
      }
    case SET_PEER:
      return {
        ...state,
        peer: action.peer
      }
    default:
      return state
  }
}
