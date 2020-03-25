import createReducer from '../../../utils/createReducer'

export const schema = {
  name: 'comments',
  id: 'id'
}

// actionTypes
export const actionTypes = {
  ADD_COMMENT: 'COMMENT/ADD_COMMENT'
}

// actions
export const actions = {
  addComment: (comment) => ({
    type: actionTypes.ADD_COMMENT,
    comment
  })
}

// reducers
const normalReducer = createReducer(schema.name)

const reducer = (state = {}, action) => {
  if (action.type === actionTypes.ADD_COMMENT) {
    return { ...state, [action.comment.id]: action.comment }
  } else {
    return normalReducer(state, action)
  }
}

export default reducer
