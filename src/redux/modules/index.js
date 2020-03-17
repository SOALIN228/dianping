import { combineReducers } from 'redux'
import entities from './entities'
import home from './home'
import app from './app'

const rootReducers = combineReducers({
  entities,
  home,
  app
})

export default rootReducers
