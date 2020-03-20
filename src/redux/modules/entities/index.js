import { combineReducers } from 'redux'
import comments from './comments'
import products from './products'
import shops from './shops'

export default combineReducers({
  comments,
  products,
  shops
})
