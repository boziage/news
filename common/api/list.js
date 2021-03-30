import $http from '../http.js'

	/* return new Promise((reslove, reject) => {
		// 调用云函数方法
		uniCloud.callFunction({
			name: 'get_label',
			data
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
	})	 */

export const get_label = data => {
	return $http({
		url:'get_label',
		data
	})
}

export const get_list = data => {
	return $http({
		url:'get_list',
		data
	})
}

export const update_like = data => {
	return $http({
		url:'update_like',
		data
	})
}

export const get_search = data => {
	return $http({
		url:'get_search',
		data
	})
}

export const update_label = data => {
	return $http({
		url:'update_label',
		data
	})
}

export const get_detail = data => {
	return $http({
		url:'get_detail',
		data
	})
}

export const update_comment = data => {
	return $http({
		url:'update_comment',
		data
	})
}

export const get_comments = data => {
	return $http({
		url:'get_comments',
		data
	})
}

export const update_author = data => {
	return $http({
		url:'update_author',
		data
	})
}

export const update_thumbsup = data => {
	return $http({
		url:'update_thumbsup',
		data
	})
}