import { combineReducers } from 'redux'
import entities from './entities'
import home from './home'
import app from './app'
import search from './search'
import login from './login'
import user from './user'
import purchase from './purchase'

const rootReducers = combineReducers({
  entities,
  home,
  app,
  search,
  login,
  user,
  purchase
})

export default rootReducers
