export const schema = {
  name: 'products',
  id: 'id'
}

export default (state = {}, action) => {
  if (action.response && action.response.products) {
    return { ...state, ...action.response.products }
  }
  return state
}
