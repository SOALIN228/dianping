import { combineReducers } from 'redux'
import comments from './comments'
import products from './products'
import shops from './shops'
import keywords from './keywords'

export default combineReducers({
  comments,
  products,
  shops,
  keywords
})
