import { combineReducers } from 'redux'
import comments from './comments'
import products from './products'

export default combineReducers({
  comments,
  products
})
