import {
  SET_HISTORY_LISTS,
  CLEAR_HISTORY,
  SET_USER_INFO
} from './mutations-types'

// context 就是当前的vuex实例对象；它拥有实例的所有方法,区别就是 context 代理了 store 一部分方法、属性
/* {
  state,      // same as store.state, or local state if in modules
  rootState,  // same as store.state, only in modules
  commit,     // same as store.commit
  dispatch,   // same as store.dispatch
  getters,    // same as store.getters, or local getters if in modules
  rootGetters // same as store.getters, only in modules
} */
/* new vuex.store({
    state: {},
    getters: {},
    mutations:{},
    actions:{
        increase(context){
            // 拥有state、getters、commit、dispatch
            // replaceState、registerModule、unregisterModule
            context.commit()
        }
    },
    modules:{}
}) */
export default {
	set_history({commit, state}, history) {
		let list = state.historyLists
		for (let i = 0; i<list.length ;i++){   
			if(list[i].name === history.name) {
				// 如果数据组存在该元素，则把该元素删除
				list.splice(i, 1);
				break;
			}
		}
		list.unshift(history)
		uni.setStorageSync("_history", list)
		commit(SET_HISTORY_LISTS, list)
	},
	
	clear_history({commit}) {
		uni.removeStorageSync("_history")
		commit(CLEAR_HISTORY)
	},
	
	set_userinfo({commit}, userinfo) {
		uni.setStorageSync("USERINFO", userinfo)
		commit(SET_USER_INFO, userinfo)
	}
}