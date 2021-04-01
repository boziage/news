import store from '../store/index.js'

export default function $http(options){
	// 解构赋值
	const {
		url,
		data
	} = options
	const dataObj = {
		user_id: store.state.userinfo._id,
		...data
	}
	return new Promise((reslove, reject) => {
		// 调用云函数方法
		uniCloud.callFunction({
			name: url,
			data: dataObj
		}).then(res => {
			if(res.result.code === 200){
				// .then
				reslove(res.result)
			}else{
				// catch
				reject(res.result)
			}
		}).catch(err => {
			reject(err)
		})
	})	
}