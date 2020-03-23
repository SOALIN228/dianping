import { combineReducers } from 'redux'
import comments from './comments'
import products from './products'
import shops from './shops'
import keywords from './keywords'
import orders from './orders'

export default combineReducers({
  comments,
  products,
  shops,
  keywords,
  orders
})
