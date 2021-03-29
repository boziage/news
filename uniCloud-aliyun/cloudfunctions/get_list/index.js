'use strict';
// 获取数据库的引用
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	// event为客户端上传的参数
	// context包含了调用信息和运行状态,获取每次调用的上下文 (能用来了解服务器运行的情况)
	
	
	// 下面等于var name = event.name,但解构赋值方便以后需要接收别的值时的拓展
	const {
		user_id,
		name,
		page = 1,
		pageSize = 10
	} = event
	
	let matchObj = {}
	if(name !== '全部'){
		matchObj = {
			classify: name
		}
	}
	// .doc(意思是获取某个id为这个的表的内容)
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids
	
	// 新操作--聚合:更精细化的去处理数据,求和,分组,指定哪些字段
	const list = await db.collection('article')
	.aggregate()
	// 追加字段
	.addFields({
		// 给定一个值和一个数组，如果值在数组中则返回 true，否则返回 false。$表示当前记录的内容
		is_like: $.in(['$_id', article_likes_ids])
	})
	// 筛选内容,返回条件成立的数据至下一流水线
	.match(matchObj)
	// 可指定某些字段返回某些不返回
	.project({
		content: 0
	})
	.skip(pageSize * (page - 1))
	.limit(pageSize)
	.end()
	
	/* // 原操作--普通查询:接受分类,通过分类去筛选数据,获取list表的数据
	const list = await db.collection('article')
	.field({
		// true 只返回这个字段,false表示不返回
		content: false
	})
	.get() */
	
	
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
