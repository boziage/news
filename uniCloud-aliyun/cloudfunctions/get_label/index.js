'use strict';
// 获取数据库的引用
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		type
	} = event
	let matchObj = {}
	
	// 如果type为all的话,返回所有内容,
	// 不为all的话,返回当前对应的参数
	if (type !== 'all') {
		matchObj = {
			current: true
		}
	}
	
	// 获取user表
	let userinfo = await db.collection('user').doc(user_id).get()
	userinfo = userinfo.data[0]
	// label_ids = ['label._id']
	// 获取label表的数据
	// const label = await db.collection('label').get()
	let label = await db.collection('label')
	.aggregate()
	.addFields({
		// 给定一个值和一个数组，如果值在数组中则返回 true，否则返回 false。给每条记录加了current字段,
		// 通过$_id,在user的表的数组里寻找有无相应的id
		current: $.in(['$_id', $.ifNull([userinfo.label_ids, []])])
	})
	.match(matchObj)
	.end()
	
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: label.data
	}
};
