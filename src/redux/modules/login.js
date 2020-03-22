// actionTypes
export const actionTypes = {
  // 登录
  LOGIN_REQUEST: 'LOGIN/LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN/LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN/LOGIN_FAILURE',
  // 登出
  LOGOUT: 'LOGIN/LOGOUT',
  // 设置账号
  SET_USERNAME: 'LOGIN/SET_USERNAME',
  // 设置密码
  SET_PASSWORD: 'LOGIN/SET_PASSWORD'
}

// actions
const loginRequest = () => ({
  type: actionTypes.LOGIN_REQUEST
})

const loginSuccess = () => ({
  type: actionTypes.LOGIN_SUCCESS
})

const loginFailure = error => ({
  type: actionTypes.LOGIN_FAILURE,
  error
})

export const actions = {
  // 登录
  login: () => {
    return (dispatch, getState) => {
      const { username, password } = getState().login
      // 用户名或密码为空
      if (!(username && username.length > 0 && password && password.length > 0)) {
        return dispatch(loginFailure('用户名和秘密不能为空！'))
      }

      dispatch(loginRequest())
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          localStorage.setItem('username', username)
          localStorage.setItem('login', true)
          dispatch(loginSuccess())
          resolve()
        }, 500)
      })
    }
  },
  // 登出
  logout: () => {
    localStorage.removeItem('username')
    localStorage.removeItem('login')
    return {
      type: actionTypes.LOGOUT
    }
  },
  setUsername: username => ({
    type: actionTypes.SET_USERNAME,
    username
  }),
  setPassword: password => ({
    type: actionTypes.SET_PASSWORD,
    password
  })
}

// reducers
const initialState = {
  username: localStorage.getItem('username') || '',
  password: '',
  isFetching: false,
  status: localStorage.getItem('login') || false // 登录态标识
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.LOGIN_SUCCESS:
      return { ...state, isFetching: false, status: true }
    case actionTypes.LOGIN_FAILURE:
      return { ...state, isFetching: false }
    case actionTypes.LOGOUT:
      return { ...state, status: false, username: '', password: '' }
    case actionTypes.SET_USERNAME:
      return { ...state, username: action.username }
    case actionTypes.SET_PASSWORD:
      return { ...state, password: action.password }
    default:
      return state
  }
}

// selectors
export const getUsername = state => state.login.username

export const getPassword = state => state.login.password

export const isLogin = state => state.login.status
