import { combineReducers } from 'redux'
import entities from './entities'
import home from './home'
import app from './app'
import search from './search'
import login from './login'

const rootReducers = combineReducers({
  entities,
  home,
  app,
  search,
  login
})

export default rootReducers
