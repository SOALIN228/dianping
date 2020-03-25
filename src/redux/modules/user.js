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
import { actions as commentActions } from './entities/comments'

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
  HIDE_DELETE_DIALOG: 'USER/HIDE_DELETE_DIALOG',
  // 显示订单评价
  SHOW_COMMENT_AREA: 'USER/SHOW_COMMENT_AREA',
  // 隐藏订单评价
  HIDE_COMMENT_AREA: 'USER/HIDE_COMMENT_AREA',
  // 编辑订单评价
  SET_COMMENT: 'USER/SET_COMMENT',
  // 订单打分
  SET_STARS: 'USER/SET_STARS',
  // 提交订单评价
  POST_COMMENT_REQUEST: 'USER/POST_COMMENT_REQUEST',
  POST_COMMENT_SUCCESS: 'USER/POST_COMMENT_SUCCESS',
  POST_COMMENT_FAILURE: 'USER/POST_COMMENT_FAILURE'
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

const postCommentRequest = () => ({
  type: actionTypes.POST_COMMENT_REQUEST
})


const postCommentSuccess = () => ({
  type: actionTypes.POST_COMMENT_SUCCESS
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
  }),
  // 显示订单评价编辑框
  showCommentArea: orderId => ({
    type: actionTypes.SHOW_COMMENT_AREA,
    orderId
  }),
  // 隐藏订单评价编辑框
  hideCommentArea: () => ({
    type: actionTypes.HIDE_COMMENT_AREA
  }),
  // 设置评价信息
  setComment: comment => ({
    type: actionTypes.SET_COMMENT,
    comment
  }),
  // 设置评价等级
  setStars: stars => ({
    type: actionTypes.SET_STARS,
    stars
  }),
  // 提交评价
  submitComment: () => {
    return (dispatch, getState) => {
      dispatch(postCommentRequest())
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const {
            currentOrder: { id, stars, comment }
          } = getState().user
          const commentObj = {
            id: +new Date(), // 评论id
            stars: stars,
            content: comment
          }
          dispatch(postCommentSuccess())
          dispatch(commentActions.addComment(commentObj))
          dispatch(orderActions.addComment(id, commentObj.id))
          resolve()
        })
      })
    }
  }
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
    isDeleting: false, // 是否正在删除
    isCommenting: false, // 是否显示评论框
    comment: '', // 评论内容
    stars: 0 // 评论等级
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
    case actionTypes.SHOW_COMMENT_AREA:
      return {
        ...state,
        id: action.orderId,
        isCommenting: true
      }
    case actionTypes.HIDE_DELETE_DIALOG:
    case actionTypes.HIDE_COMMENT_AREA:
    case actionTypes.DELETE_ORDER_SUCCESS:
    case actionTypes.DELETE_ORDER_FAILURE:
    case actionTypes.POST_COMMENT_SUCCESS:
    case actionTypes.POST_COMMENT_FAILURE:
      return initialState.currentOrder
    case actionTypes.SET_COMMENT:
      return { ...state, comment: action.comment }
    case actionTypes.SET_STARS:
      return { ...state, stars: action.stars }
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
  return state.user.currentOrder && state.user.currentOrder.isDeleting
    ? state.user.currentOrder.id
    : null
}

export const getCommentingOrderId = state => {
  return state.user.currentOrder && state.user.currentOrder.isCommenting
    ? state.user.currentOrder.id
    : null
}

export const getCurrentOrderComment = state => {
  return state.user.currentOrder ? state.user.currentOrder.comment : ''
}

export const getCurrentOrderStars = state => {
  return state.user.currentOrder ? state.user.currentOrder.stars : 0
}
