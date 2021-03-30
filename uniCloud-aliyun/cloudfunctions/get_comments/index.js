'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	
	const {
		user_id,
		article_id,
		pageSize = 10,
		page = 1,
	} = event
	
	const list = await db.collection('article').aggregate()
	.match({
		_id: article_id
	})
	// 将comments里面的拆分,这样会变成多个元素
	.unwind('$comments')
	.project({
		_id: 0,
		comments: 1
	})
	// comments变为根节点(data?)
	.replaceRoot({
		newRoot:'$comments'
	})
	.skip(pageSize * (page - 1))
	.limit(pageSize)
	.end()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
