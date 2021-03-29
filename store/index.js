// vuex 状态管理
import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

// 1.安装插件
Vue.use(Vuex)

// 2.创建Store对象
const state ={
	// 用本地缓存持久化数据,避免刷新页面数据初始
	historyLists: uni.getStorageSync("_history") || [],
}
const store = new Vuex.Store({
  state,
  // mutations唯一的目的就是修改state中状态
  // mutations中的每个方法尽可能完成的事件比较单一一点
  mutations,
  actions,
  // getters,
})

// 3.挂载到Vue实例上
export default store