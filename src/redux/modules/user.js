import url from '../../utils/url'
import { combineReducers } from 'redux'
import { FETCH_DATA } from '../middleware/api'
import { AVAILABLE_TYPE, getOrderById, REFUND_TYPE, schema, TO_PAY_TYPE } from './entities/orders'

// actionTypes
export const actionTypes = {
  // 获取订单列表
  FETCH_ORDERS_REQUEST: 'USER/FETCH_ORDERS_REQUEST',
  FETCH_ORDERS_SUCCESS: 'USER/FETCH_ORDERS_SUCCESS',
  FETCH_ORDERS_FAILURE: 'USER/FETCH_ORDERS_FAILURE',
  // 设置当选选中的tab
  SET_CURRENT_TAB: 'USER/SET_CURRENT_TAB'
}

// action
const fetchOrders = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_ORDERS_REQUEST,
      actionTypes.FETCH_ORDERS_SUCCESS,
      actionTypes.FETCH_ORDERS_FAILURE
    ],
    endpoint,
    schema
  }
})

export const actions = {
  // 获取订单列表
  loadOrders: () => {
    return (dispatch, getState) => {
      // 是否获取过订单数据
      const { ids } = getState().user.orders
      if (ids.length > 0) {
        return null
      }

      const endpoint = url.getOrders()
      return dispatch(fetchOrders(endpoint))
    }
  },
  // 切换tab
  setCurrentTab: index => ({
    type: actionTypes.SET_CURRENT_TAB,
    index
  })
}

//  reducers
const initialState = {
  orders: {
    isFetching: false,
    ids: [],
    toPayIds: [], // 待付款的订单id
    availableIds: [], // 可使用的订单id
    refundIds: [] // 退款订单id
  },
  currentTab: 0
}

const orders = (state = initialState.orders, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ORDERS_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_ORDERS_SUCCESS:
      const toPayIds = action.response.ids.filter(id => {
        return action.response.orders[id].type === TO_PAY_TYPE
      })
      const availableIds = action.response.ids.filter(id => {
        return action.response.orders[id].type === AVAILABLE_TYPE
      })
      const refundIds = action.response.ids.filter(id => {
        return action.response.orders[id].type === REFUND_TYPE
      })
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids),
        toPayIds: state.ids.concat(toPayIds),
        availableIds: state.ids.concat(availableIds),
        refundIds: state.ids.concat(refundIds)
      }
    case actionTypes.FETCH_ORDERS_FAILURE:
      return { ...state, isFetching: true }
    default:
      return state
  }
}

const currentTab = (state = initialState.currentTab, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_TAB:
      return action.index
    default:
      return state
  }
}

export default combineReducers({
  currentTab,
  orders
})

// selectors
export const getCurrentTab = state => state.user.currentTab

export const getOrders = state => {
  const key = ['ids', 'toPayIds', 'availableIds', 'refundIds'][state.user.currentTab]
  return state.user.orders[key].map(id => {
    return getOrderById(state, id)
  })
}
