import Vue from 'vue'
import store from './store'

import App from './App'
import api from './common/api'

Vue.config.productionTip = false

Vue.prototype.$api = api

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
