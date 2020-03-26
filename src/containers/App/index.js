import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ErrorToast from '../../components/ErrorToast'
import AsyncComponent from '../../utils/AsyncComponent'
import PrivateRoute from '../PrivateRoute'
import { actions as appActions, getError } from '../../redux/modules/app'

const Home = AsyncComponent(() => import('../Home'))
const ProductDetail = AsyncComponent(() => import('../ProductDetail'))
const Search = AsyncComponent(() => import('../Search'))
const SearchResult = AsyncComponent(() => import('../SearchResult'))
const Login = AsyncComponent(() => import('../Login'))
const User = AsyncComponent(() => import('../User'))
const Purchase = AsyncComponent(() => import('../Purchase'))

class App extends Component {
  render () {
    const { error, appActions: { clearError } } = this.props
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/user" component={User}/>
            <Route path="/detail/:id" component={ProductDetail}/>
            <Route path="/purchase/:id" component={Purchase}/>
            <Route path="/search" component={Search}/>
            <Route path="/search_result" component={SearchResult}/>
            <Route path="/" component={Home}/>
          </Switch>
          {error ? <ErrorToast msg={error} clearError={clearError}/> : null}
        </Router>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    error: getError(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
