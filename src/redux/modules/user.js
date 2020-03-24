import url from '../../utils/url'
import { combineReducers } from 'redux'
import { FETCH_DATA } from '../middleware/api'
import {
  AVAILABLE_TYPE,
  getOrderById,
  REFUND_TYPE,
  schema,
  TO_PAY_TYPE,
  actions as orderActions,
  actionTypes as orderActionTypes
} from './entities/orders'

// actionTypes
export const actionTypes = {
  // 获取订单列表
  FETCH_ORDERS_REQUEST: 'USER/FETCH_ORDERS_REQUEST',
  FETCH_ORDERS_SUCCESS: 'USER/FETCH_ORDERS_SUCCESS',
  FETCH_ORDERS_FAILURE: 'USER/FETCH_ORDERS_FAILURE',
  // 设置当选选中的tab
  SET_CURRENT_TAB: 'USER/SET_CURRENT_TAB',
  // 删除指定订单
  DELETE_ORDER_REQUEST: 'USER/DELETE_ORDER_REQUEST',
  DELETE_ORDER_SUCCESS: 'USER/DELETE_ORDER_SUCCESS',
  DELETE_ORDER_FAILURE: 'USER/DELETE_ORDER_FAILURE',
  // 显示删除确认对话框
  SHOW_DELETE_DIALOG: 'USER/SHOW_DELETE_DIALOG',
  // 隐藏删除确认对话框
  HIDE_DELETE_DIALOG: 'USER/HIDE_DELETE_DIALOG'
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

const deleteOrderRequest = () => ({
  type: actionTypes.DELETE_ORDER_REQUEST
})

const deleteOrderSuccess = (orderId) => ({
  type: actionTypes.DELETE_ORDER_SUCCESS,
  orderId
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
  }),
  // 删除订单
  removeOrder: () => {
    return (dispatch, getState) => {
      const { id } = getState().user.currentOrder
      // 订单ID是否存在
      if (id) {
        dispatch(deleteOrderRequest())
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            dispatch(deleteOrderSuccess(id))
            dispatch(orderActions.deleteOrder(id))
            resolve()
          }, 500)
        })
      }
    }
  },
  // 显示删除对话框
  showDeleteDialog: orderId => ({
    type: actionTypes.SHOW_DELETE_DIALOG,
    orderId
  }),
  // 隐藏删除对话框
  hideDeleteDialog: () => ({
    type: actionTypes.HIDE_DELETE_DIALOG
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
  currentTab: 0, // 当前选中tab页
  currentOrder: {
    id: null,
    isDeleting: false // 是否正在删除
  }
}

const removeOrderId = (state, key, orderId) => {
  return state[key].filter(id => {
    return id !== orderId
  })
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
    case orderActionTypes.DELETE_ORDER:
    case actionTypes.DELETE_ORDER_SUCCESS:
      return {
        ...state,
        ids: removeOrderId(state, 'ids', action.orderId),
        toPayIds: removeOrderId(state, 'toPayIds', action.orderId),
        availableIds: removeOrderId(state, 'availableIds', action.orderId),
        refundIds: removeOrderId(state, 'refundIds', action.orderId)
      }
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

const currentOrder = (state = initialState.currentOrder, action) => {
  switch (action.type) {
    case actionTypes.SHOW_DELETE_DIALOG:
      return {
        ...state,
        id: action.orderId,
        isDeleting: true
      }
    case actionTypes.HIDE_DELETE_DIALOG:
    case actionTypes.DELETE_ORDER_SUCCESS:
    case actionTypes.DELETE_ORDER_FAILURE:
      return initialState.currentOrder
    default:
      return state
  }
}

export default combineReducers({
  currentTab,
  orders,
  currentOrder
})

// selectors
export const getCurrentTab = state => state.user.currentTab

export const getOrders = state => {
  const key = ['ids', 'toPayIds', 'availableIds', 'refundIds'][state.user.currentTab]
  return state.user.orders[key].map(id => {
    return getOrderById(state, id)
  })
}

export const getDeletingOrderId = (state) => {
  return state.user.currentOrder && state.user.currentOrder.isDeleting ? state.user.currentOrder.id : null
}
