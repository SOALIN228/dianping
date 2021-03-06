import url from '../../utils/url'
import { combineReducers } from 'redux'
import { FETCH_DATA } from '../middleware/api'
import { getAllProductDetail, schema } from './entities/products'
import { createSelector } from 'reselect'

// actionTypes
export const actionTypes = {
  // 获取猜你喜欢数据
  FETCH_LIKES_REQUEST: 'HOME/FETCH_LIKES_REQUEST',
  FETCH_LIKES_SUCCESS: 'HOME/FETCH_LIKES_SUCCESS',
  FETCH_LIKES_FAILURE: 'HOME/FETCH_LIKES_FAILURE',
  // 获取超值特惠信息
  FETCH_DISCOUNTS_REQUEST: 'HOME/FETCH_DISCOUNTS_REQUEST',
  FETCH_DISCOUNTS_SUCCESS: 'HOME/FETCH_DISCOUNTS_SUCCESS',
  FETCH_DISCOUNTS_FAILURE: 'HOME/FETCH_DISCOUNTS_FAILURE'
}

// actions
// 请求参数使用到的常量对象
export const params = {
  PATH_LIKES: 'likes',
  PATH_DISCOUNTS: 'discounts',
  PAGE_SIZE_LIKES: 5,
  PAGE_SIZE_DISCOUNTS: 3
}

const fetchLikes = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_LIKES_REQUEST,
      actionTypes.FETCH_LIKES_SUCCESS,
      actionTypes.FETCH_LIKES_FAILURE
    ],
    endpoint,
    schema
  }
})

const fetchDiscounts = endpoint => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_DISCOUNTS_REQUEST,
      actionTypes.FETCH_DISCOUNTS_SUCCESS,
      actionTypes.FETCH_DISCOUNTS_FAILURE
    ],
    endpoint,
    schema
  }
})

export const actions = {
  // 加载猜你喜欢的数据
  loadLikes: () => {
    return (dispatch, getState) => {
      const { pageCount } = getState().home.likes
      const rowIndex = pageCount * params.PAGE_SIZE_LIKES
      const endpoint = url.getProductList(
        params.PATH_LIKES,
        rowIndex,
        params.PAGE_SIZE_LIKES
      )
      return dispatch(fetchLikes(endpoint))
    }
  },
  //加载特惠商品
  loadDiscounts: () => {
    return (dispatch, getState) => {
      // 切换页面再次加载时，优先使用缓存
      const { ids } = getState().home.discounts
      if (ids.length > 0) {
        return null
      }

      const endpoint = url.getProductList(
        params.PATH_DISCOUNTS,
        0,
        params.PAGE_SIZE_DISCOUNTS
      )
      return dispatch(fetchDiscounts(endpoint))
    }
  }
}

// reducers
const initialState = {
  likes: {
    isFetching: false,
    pageCount: 0,
    ids: []
  },
  discounts: {
    isFetching: false,
    ids: []
  }
}

const likes = (state = initialState.likes, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LIKES_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_LIKES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        pageCount: state.pageCount + 1,
        ids: state.ids.concat(action.response.ids)
      }
    case actionTypes.FETCH_LIKES_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

const discounts = (state = initialState.discounts, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DISCOUNTS_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids)
      }
    case actionTypes.FETCH_DISCOUNTS_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

export default combineReducers({
  likes,
  discounts
})

// selectors
export const getAllLikeId = state => {
  return state.home.likes.ids
}

export const getAllDiscountId = state => {
  return state.home.discounts.ids
}

export const getLikes = createSelector(
  [getAllLikeId, getAllProductDetail],
  (likeIds, products) => {
    return likeIds.map(id => {
      return products[id]
    })
  }
)

export const getDiscounts = createSelector(
  [getAllDiscountId, getAllProductDetail],
  (discountIds, products) => {
    return discountIds.map(id => {
      return products[id]
    })
  }
)

export const getPageCountOfLikes = state => {
  return state.home.likes.pageCount
}
