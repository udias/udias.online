/**
 * # Module: Response
 *
 * Keeps intermediata data of the processing task.
 */


const TOGGLE_CONFIRMED = '@uidas/response/TOGGLE_CONFIRMED'

export function toggleConfirmed () {
  return {
    type: TOGGLE_CONFIRMED
  }
}

const initialState = {
  confirmed: false
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_CONFIRMED:
      return {
        ...state,
        confirmed: !state.confirmed
      }
    default:
      return state
  }
}
