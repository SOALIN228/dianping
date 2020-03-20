import url from '../../utils/url'
import { combineReducers } from 'redux'
import { FETCH_DATA } from '../middleware/api'
import { getProductById, getProductDetail, schema as productSchema } from './entities/products'
import { getShopById, schema as shopSchema } from './entities/shops'

// actionTypes
export const actionTypes = {
  // 获取产品详情
  FETCH_PRODUCT_DETAIL_REQUEST: 'DETAIL/FETCH_PRODUCT_DETAIL_REQUEST',
  FETCH_PRODUCT_DETAIL_SUCCESS: 'DETAIL/FETCH_PRODUCT_DETAIL_SUCCESS',
  FETCH_PRODUCT_DETAIL_FAILURE: 'DETAIL/FETCH_PRODUCT_DETAIL_FAILURE',
  // 获取关联店铺信息
  FETCH_SHOP_REQUEST: 'DETAIL/FETCH_SHOP_REQUEST',
  FETCH_SHOP_SUCCESS: 'DETAIL/FETCH_SHOP_SUCCESS',
  FETCH_SHOP_FAILURE: 'DETAIL/FETCH_SHOP_FAILURE'
}

// action
const fetchProductDetailSuccess = id => ({
  type: actionTypes.FETCH_PRODUCT_DETAIL_SUCCESS,
  id
})

const fetchShopSuccess = id => ({
  type: actionTypes.FETCH_SHOP_SUCCESS,
  id
})

const fetchProductDetail = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_PRODUCT_DETAIL_REQUEST,
      actionTypes.FETCH_PRODUCT_DETAIL_SUCCESS,
      actionTypes.FETCH_PRODUCT_DETAIL_FAILURE
    ],
    endpoint,
    schema: productSchema
  },
  id
})

const fetchShopById = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_SHOP_REQUEST,
      actionTypes.FETCH_SHOP_SUCCESS,
      actionTypes.FETCH_SHOP_FAILURE
    ],
    endpoint,
    schema: shopSchema
  },
  id
})

export const actions = {
  // 获取商品详情
  loadProductDetail: id => {
    return (dispatch, getState) => {
      // 存在缓存数据
      const product = getProductDetail(getState(), id)
      if (product) {
        return dispatch(fetchProductDetailSuccess(id))
      }

      const endpoint = url.getProductDetail(id)
      return dispatch(fetchProductDetail(endpoint, id))
    }
  },
  // 获取店铺信息
  loadShopById: id => {
    return (dispatch, getState) => {
      // 存在缓存数据
      const shop = getShopById(getState(), id)
      if (shop) {
        return dispatch(fetchShopSuccess(id))
      }

      const endpoint = url.getShopById(id)
      return dispatch(fetchShopById(endpoint, id))
    }
  }
}

// reducers
const initialState = {
  product: {
    isFetching: false,
    ids: null
  },
  relatedShop: {
    isFetching: false,
    ids: null
  }
}

const product = (state = initialState.product, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PRODUCT_DETAIL_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_PRODUCT_DETAIL_SUCCESS:
      return { ...state, ids: action.id, isFetching: false }
    case actionTypes.FETCH_PRODUCT_DETAIL_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

const relatedShop = (state = initialState.relatedShop, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SHOP_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_SHOP_SUCCESS:
      return { ...state, ids: action.id, isFetching: false }
    case actionTypes.FETCH_SHOP_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

export default combineReducers({
  product,
  relatedShop
})

// selectors
export const getProduct = (state, id) => {
  return getProductDetail(state, id)
}

export const getRelatedShop = (state, productId) => {
  const product = getProductById(state, productId)
  let shopId = product ? product.nearestShop : null
  if (shopId) {
    return getShopById(state, shopId)
  }
  return null
}
