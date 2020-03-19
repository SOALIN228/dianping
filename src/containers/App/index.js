import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ErrorToast from '../../components/ErrorToast'
import { actions as appActions, getError } from '../../redux/modules/app'
import Home from '../Home'

class App extends Component {
  render () {
    const { error, appActions: { clearError } } = this.props
    return (
      <div>
        <Router>
          <Switch>
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
