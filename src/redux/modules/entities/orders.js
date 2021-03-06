import createReducer from '../../../utils/createReducer'

export const schema = {
  name: 'orders',
  id: 'id',
}

export const USED_TYPE = 1 // 已消费
export const TO_PAY_TYPE = 2 // 待付款
export const AVAILABLE_TYPE = 3 // 可使用
export const REFUND_TYPE = 4 // 退款

let orderIdCounter = 10

// actionTypes
export const actionTypes = {
  // 删除订单
  DELETE_ORDER: 'ORDERS/DELETE_ORDER',
  // 增加订单
  ADD_ORDER: 'ORDERS/ADD_ORDER',
  // 新增评价
  ADD_COMMENT: 'ORDERS/ADD_COMMENT'
}

// actions
export const actions = {
  // 删除订单
  deleteOrder: (orderId) => ({
    type: actionTypes.DELETE_ORDER,
    orderId
  }),
  // 增加订单
  addOrder: order => {
    const orderId = `o-${orderIdCounter++}`
    return {
      type: actionTypes.ADD_ORDER,
      orderId,
      order: { ...order, id: orderId }
    }
  },
  // 新增评价
  addComment: (orderId, commentId) => ({
    type: actionTypes.ADD_COMMENT,
    orderId,
    commentId
  })
}

// reducers
const normalReducer = createReducer(schema.name)

const reducer = (state = {}, action) => {
  if (action.type === actionTypes.ADD_COMMENT) {
    return {
      ...state,
      [action.orderId]: {
        ...state[action.orderId],
        commentId: action.commentId
      }
    }
  } else if (action.type === actionTypes.ADD_ORDER) {
    return {
      ...state,
      [action.orderId]: action.order
    }
  } else if (action.type === actionTypes.DELETE_ORDER) {
    const { [action.orderId]: deleteOrder, ...restOrders } = state
    return restOrders
  } else {
    return normalReducer(state, action)
  }
}

export default reducer

// selectors
export const getOrderById = (state, id) => {
  return state.entities.orders[id]
}

export const getAllOrders = (state) => state.entities.orders
