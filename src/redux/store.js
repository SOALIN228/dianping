import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import api from './middleware/api'
import rootReducers from './modules'

let composeEnhancers
// 开发环境并安装了devtools
if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
} else {
  composeEnhancers = compose
}

const store = createStore(rootReducers, composeEnhancers(
  applyMiddleware(thunk, api)
))

export default store
