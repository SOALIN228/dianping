// actionTypes
export const actionTypes = {
  CLEAR_ERROR: 'APP/CLEAR_ERROR'
}

// actions
export const actions = {
  clearError: () => ({
    type: actionTypes.CLEAR_ERROR
  })
}

// reducers
const initialState = {
  error: null
}

export default (state = initialState, action) => {
  const { type, error } = action
  if (type === actionTypes.CLEAR_ERROR) {
    return { ...state, error: null }
  } else if (error) {
    return { ...state, error: error }
  }
  return state
}

// selectors
export const getError = (state) => {
  return state.app.error
}
