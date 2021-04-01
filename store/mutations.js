import {
  SET_HISTORY_LISTS,
  CLEAR_HISTORY,
  SET_USER_INFO
} from './mutations-types'

export default {
  // mutations唯一的目的就是修改state中状态
  // mutations中的每个方法尽可能完成的事件比较单一一点
  [SET_HISTORY_LISTS](state, history){
    state.historyLists = history
  },
  
  [CLEAR_HISTORY](state){
	state.historyLists = []
  },
  
  [SET_USER_INFO](state, userinfo){
	  state.userinfo = userinfo
  }
}