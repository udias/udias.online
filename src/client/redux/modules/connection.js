/**
 * # Module: Connection
 *
 * Contains data which are specific for the connection of client instance.
 */

const UPDATE_ADDRESS = '@@udias/connection/UPDATE_ADDRESS'
const UPDATE_DETAILS = '@@udias/connection/UPDATE_DETAILS'

export function updateAddress (address) {
  return {
    type: UPDATE_ADDRESS,
    address
  }
}

export function updateDetails (details) {
  return {
    type: UPDATE_ADDRESS,
    details
  }
}

const initialState = {
  address: '',
  details: null
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_ADDRESS:
      return {
        ...state,
        address: action.address
      }
    case UPDATE_DETAILS:
      return {
        ...state,
        details: action.details
      }
    default:
      return state
  }
}
