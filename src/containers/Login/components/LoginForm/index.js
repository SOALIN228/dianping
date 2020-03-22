import React, { Component } from 'react'
import './style.css'

class LoginForm extends Component {
  render () {
    const { username, password, onChange, onSubmit } = this.props
    return (
      <div className="loginForm">
        <div className="loginForm__inputContainer">
          <div className="loginForm__row">
            <label htmlFor="username" className="loginForm__mobileLabel">86</label>
            <input type="text" className="loginForm__input"
                   name="username" id="username"
                   value={username}
                   onChange={onChange}
            />
          </div>
          <div className="loginForm__row">
            <label htmlFor="password" className="loginForm__passwordLabel">密码</label>
            <input type="password" className="loginForm__input"
                   name="password" id="password"
                   value={password}
                   onChange={onChange}
            />
          </div>
        </div>
        <div className="loginForm__btnContainer">
          <button className="loginForm__btn" onClick={onSubmit}>
            登录
          </button>
        </div>
      </div>
    )
  }
}

export default LoginForm
