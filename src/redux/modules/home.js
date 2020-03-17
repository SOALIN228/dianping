import url from '../../utils/url'
import { FETCH_DATA } from '../middleware/api'
import { schema } from './entities/products'

// actionTypes
export const actionTypes = {
  FETCH_LIKES_REQUEST: 'HOME/FETCH_LIKES_REQUEST',
  FETCH_LIKES_SUCCESS: 'HOME/FETCH_LIKES_SUCCESS',
  FETCH_LIKES_FAILURE: 'HOME/FETCH_LIKES_FAILURE',
}

// actions
const fetchLikes = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_LIKES_REQUEST,
      actionTypes.FETCH_LIKES_SUCCESS,
      actionTypes.FETCH_LIKES_FAILURE
    ],
    endpoint,
    schema
  }
})

export const actions = {
  loadLikes: () => {
    return (dispatch, getState) => {
      const endpoint = url.getProductList(0, 10)
      return dispatch(fetchLikes(endpoint))
    }
  }
}

// reducers
export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LIKES_REQUEST:
      return null
    case actionTypes.FETCH_LIKES_SUCCESS:
      return null
    case actionTypes.FETCH_LIKES_FAILURE:
      return null
    default:
      return state
  }
}
