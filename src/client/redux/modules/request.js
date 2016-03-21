/**
 * # Module: Request
 *
 * Keeps intermediata data of the request task.
 */

const CREATE_REQUEST = '@@udias/request/CREATE_REQUEST'
const UPDATE_VALUE = '@@udias/request/UPDATE_VALUE'
const UPDATE_SCOPE = '@@udias/request/UPDATE_SCOPE'
const TOGGLE_CONFIRMED = '@@udias/request/TOGGLE_CONFIRMED'
const TOGGLE_DETAILS = '@udias/request/TOGGLE_DETAILS'
const UPDATE_MANIFEST = '@@udias/request/UPDATE_MANIFEST'
const ADD_RESULT = '@@udias/request/ADD_RESULT'

export function createRequest (requestType) {
  return {
    type: CREATE_REQUEST,
    requestType
  }
}

export function updateValue (name, value) {
  return {
    type: UPDATE_VALUE,
    name,
    value
  }
}

export function updateScope (scope) {
  return {
    type: UPDATE_SCOPE,
    scope
  }
}

export function toggleConfirmed(){
  return {
    type: TOGGLE_CONFIRMED
  }
}

export function toggleDetails(){
  return {
    type: TOGGLE_DETAILS
  }
}

export function updateManifest (manifest) {
  return {
    type: UPDATE_MANIFEST,
    manifest
  }
}

export function addResult (result) {
  return {
    type: ADD_RESULT,
    result
  }
}

// resetRequest

const initialState = {
  type: '',
  values: {}, // read from task what the deifnitions are ... not here !
  scope: 'global',
  manifest: null,
  confirmed: false,
  details: false,
  results: []
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_REQUEST:
      return {
        ...initialState,
        type: action.requestType
      }
    case UPDATE_VALUE:
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value
        }
      }
    case UPDATE_SCOPE:
      return {
        ...state,
        scope: action.scope
      }
    case TOGGLE_CONFIRMED:
      return {
        ...state,
        confirmed: !state.confirmed
      }
    case TOGGLE_DETAILS:
      return {
        ...state,
        details: !state.details
      }
    case UPDATE_MANIFEST:
      return {
        ...state,
        manifest: state.manifest
      }
    case ADD_RESULT:
      return {
        ...state,
        results: [...state.results, action.result]
      }
    default:
      return state
  }
}
