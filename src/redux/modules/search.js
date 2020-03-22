import url from '../../utils/url'
import { combineReducers } from 'redux'
import { FETCH_DATA } from '../middleware/api'
import { getKeywordById, schema as keywordSchema } from './entities/keywords'
import { getShopById, schema as shopSchema } from './entities/shops'

// actionTypes
export const actionTypes = {
  // 获取热门关键词
  FETCH_POPULAR_KEYWORDS_REQUEST: 'SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST',
  FETCH_POPULAR_KEYWORDS_SUCCESS: 'SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS',
  FETCH_POPULAR_KEYWORDS_FAILURE: 'SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE',
  // 根据输入的文本获取相关关键词
  FETCH_RELATED_KEYWORDS_REQUEST: 'SEARCH/FETCH_RELATED_KEYWORDS_REQUEST',
  FETCH_RELATED_KEYWORDS_SUCCESS: 'SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS',
  FETCH_RELATED_KEYWORDS_FAILURE: 'SEARCH/FETCH_RELATED_KEYWORDS_FAILURE',
  // 根据关键词查询结果
  FETCH_SHOPS_REQUEST: 'SEARCH/FETCH_SHOPS_REQUEST',
  FETCH_SHOPS_SUCCESS: 'SEARCH/FETCH_SHOPS_SUCCESS',
  FETCH_SHOPS_FAILURE: 'SEARCH/FETCH_SHOPS_FAILURE',
  // 输入文本相关操作
  SET_INPUT_TEXT: 'SEARCH/SET_INPUT_TEXT',
  CLEAR_INPUT_TEXT: 'SEARCH/CLEAR_INPUT_TEXT',
  // 历史记录相关操作
  ADD_HISTORY_KEYWORD: 'SEARCH/ADD_HISTORY_KEYWORD',
  CLEAR_HISTORY_KEYWORDS: 'SEARCH/CLEAR_HISTORY_KEYWORDS',
}

// actions
const fetchPopularKeywords = endpoint => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_POPULAR_KEYWORDS_REQUEST,
      actionTypes.FETCH_POPULAR_KEYWORDS_SUCCESS,
      actionTypes.FETCH_POPULAR_KEYWORDS_FAILURE
    ],
    endpoint,
    schema: keywordSchema
  }
})

const fetchRelatedKeywords = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_RELATED_KEYWORDS_REQUEST,
      actionTypes.FETCH_RELATED_KEYWORDS_SUCCESS,
      actionTypes.FETCH_RELATED_KEYWORDS_FAILURE
    ],
    endpoint,
    schema: keywordSchema
  },
  text
})

const fetchRelatedShops = (keyword, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      actionTypes.FETCH_SHOPS_REQUEST,
      actionTypes.FETCH_SHOPS_SUCCESS,
      actionTypes.FETCH_SHOPS_FAILURE
    ],
    endpoint,
    schema: shopSchema
  },
  keyword
})

export const actions = {
  // 获取热门关键词
  loadPopularKeywords: () => {
    return (dispatch, getState) => {
      // 已获取过热门关键字
      const { ids } = getState().search.popularKeywords
      if (ids.length > 0) {
        return null
      }

      const endpoit = url.getPopularKeywords()
      return dispatch(fetchPopularKeywords(endpoit))
    }
  },
  // 根据输入获取相关关键词
  loadRelatedKeywords: text => {
    return (dispatch, getState) => {
      // 输入关键字为空
      if (text.trim().length === 0) {
        return null
      }

      // 已获取过输入关键字
      const { relatedKeywords } = getState().search
      if (relatedKeywords[text]) {
        return null
      }

      const endpoint = url.getRelatedKeywords(text)
      return dispatch(fetchRelatedKeywords(text, endpoint))
    }
  },
  // 获取查询到的店铺列表
  loadRelatedShops: keyword => {
    return (dispatch, getState) => {
      // 已获取过相关店铺信息
      const { searchedShopsByKeyword } = getState().search
      if (searchedShopsByKeyword[keyword]) {
        return null
      }
      const endpoint = url.getRelatedShops(keyword)
      return dispatch(fetchRelatedShops(keyword, endpoint))
    }
  },
  // 搜索框输入文本
  setInputText: text => ({
    type: actionTypes.SET_INPUT_TEXT,
    text
  }),
  // 清除输入文本
  clearInputText: () => ({
    type: actionTypes.CLEAR_INPUT_TEXT
  }),
  // 添加历史查询记录
  addHistoryKeyword: keywordId => ({
    type: actionTypes.ADD_HISTORY_KEYWORD,
    text: keywordId
  }),
  // 清除历史查询记录
  clearHistoryKeywords: () => ({
    type: actionTypes.CLEAR_HISTORY_KEYWORDS
  })
}

// reducers
const initialState = {
  inputText: '',
  popularKeywords: {
    isFetching: false,
    ids: []
  },
  /**
   * relatedKeywords对象结构：
   * {
   *   '火锅': {
   *       isFetching: false,
   *       ids: []
   *    }
   * }
   */
  relatedKeywords: {},
  historyKeywords: [], // 保存关键词id
  /**
   * searchedShopsByKeywords结构
   * {
   *   'keywordId': {
   *       isFetching: false,
   *       ids: []
   *    }
   * }
   */
  searchedShopsByKeyword: {}
}

const popularKeywords = (state = initialState.popularKeywords, action) => {
  switch (action.type) {
    case actionTypes.FETCH_POPULAR_KEYWORDS_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_POPULAR_KEYWORDS_SUCCESS:
      return {
        ...state,
        ids: state.ids.concat(action.response.ids),
        isFetching: false
      }
    case actionTypes.FETCH_POPULAR_KEYWORDS_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

const relatedKeywords = (state = initialState.relatedKeywords, action) => {
  switch (action.type) {
    case actionTypes.FETCH_RELATED_KEYWORDS_REQUEST:
    case actionTypes.FETCH_RELATED_KEYWORDS_SUCCESS:
    case actionTypes.FETCH_RELATED_KEYWORDS_FAILURE:
      return {
        ...state,
        [action.text]: relatedKeywordsByText(state[action.text], action)
      }
    default:
      return state
  }
}

const relatedKeywordsByText = (
  state = { isFetching: false, ids: [] },
  action
) => {
  switch (action.type) {
    case actionTypes.FETCH_RELATED_KEYWORDS_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_RELATED_KEYWORDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids)
      }
    case actionTypes.FETCH_RELATED_KEYWORDS_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

const searchedShopsByKeyword = (state = initialState.searchedShopsByKeyword, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SHOPS_REQUEST:
    case actionTypes.FETCH_SHOPS_SUCCESS:
    case actionTypes.FETCH_SHOPS_FAILURE:
      return {
        ...state,
        [action.keyword]: searchedShops(state[action.keyword], action)
      }
    default:
      return state
  }
}

const searchedShops = (
  state = { isFetching: false, ids: [] },
  action
) => {
  switch (action.type) {
    case actionTypes.FETCH_SHOPS_REQUEST:
      return { ...state, isFetching: true }
    case actionTypes.FETCH_SHOPS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: action.response.ids
      }
    case actionTypes.FETCH_SHOPS_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

const inputText = (state = initialState.inputText, action) => {
  switch (action.type) {
    case actionTypes.SET_INPUT_TEXT:
      return action.text
    case actionTypes.CLEAR_INPUT_TEXT:
      return ''
    default:
      return state
  }
}

const historyKeywords = (state = initialState.historyKeywords, action) => {
  switch (action.type) {
    case actionTypes.ADD_HISTORY_KEYWORD:
      // 过滤历史记录中不等于搜索数据内容
      const data = state.filter(item => {
        return item !== action.text
      })
      // 将搜索内容插入数租首位
      return [action.text, ...data]
    case actionTypes.CLEAR_HISTORY_KEYWORDS:
      return []
    default:
      return state
  }
}

export default combineReducers({
  popularKeywords,
  relatedKeywords,
  inputText,
  historyKeywords,
  searchedShopsByKeyword
})

// selectors
export const getPopularKeywords = state => {
  return state.search.popularKeywords.ids.map(id => {
    return getKeywordById(state, id)
  })
}

export const getRelatedKeywords = state => {
  // 输入值非空检测
  const text = state.search.inputText
  if (!text || text.trim().length === 0) {
    return []
  }

  // 检测是否有输入关键字信息
  const relatedKeywords = state.search.relatedKeywords[text]
  if (!relatedKeywords) {
    return []
  }

  return relatedKeywords.ids.map(id => {
    return getKeywordById(state, id)
  })
}

export const getInputText = state => {
  return state.search.inputText
}

export const getHistoryKeywords = state => {
  return state.search.historyKeywords.map(id => {
    return getKeywordById(state, id)
  })
}

export const getSearchedShops = state => {
  // 获取搜索关键字
  const keywordId = state.search.historyKeywords[0]
  if (!keywordId) {
    return []
  }

  const shops = state.search.searchedShopsByKeyword[keywordId]
  return shops.ids.map(id => {
    return getShopById(state, id)
  })
}

export const getCurrentKeyword = state => {
  const keywordId = state.search.historyKeywords[0]
  if (!keywordId) {
    return ''
  }
  return getKeywordById(state, keywordId).keyword
}
