import {
  SET_HISTORY_LISTS,
  CLEAR_HISTORY
} from './mutations-types'

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
	}
}