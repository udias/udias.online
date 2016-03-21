/**
 * # Module: Socket
 *
 * Contains data received from the websocket connection with the server.
 */

const UPDATE_GLOBAL_ENTRIES = '@@udias/socket/UPDATE_GLOABL_ENTRIES'
const UPDATE_LOCAL_ENTRIES = '@@udias/socket/UPDATE_LOCALE_ENTRIES'
const UPDATE_TYPES = '@@udias/socket/UPDATE_TYPES'

export function updateTypes (types) {
  return {
    type: UPDATE_TYPES,
    types
  }
}

export function updateGlobalEntries (globalEntries) {
  return {
    type: UPDATE_GLOBAL_ENTRIES,
    globalEntries
  }
}

export function updateLocalEntries (localEntries) {
  return {
    type: UPDATE_LOCAL_ENTRIES,
    localEntries
  }
}

const initialState = {
  types: [],
  entries: {
    global: [],
    local: []
  }
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_TYPES: {
      return {
        ...state,
        types: action.types
      }
    }
    case UPDATE_GLOBAL_ENTRIES: {
      return {
        ...state,
        entries: {
          ...state.entries,
          global: action.globalEntries
        }
      }
    }
    case UPDATE_LOCAL_ENTRIES: {
      return {
        ...state,
        entries: {
          ...state.entries,
          local: action.localEntries
        }
      }
    }
    default:
      return state
  }
}
