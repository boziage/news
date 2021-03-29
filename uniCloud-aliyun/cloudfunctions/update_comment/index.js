'use strict';
const db = uniCloud.database()
// 聚合操作符
const $ = db.command.aggregate
// 查询条件操作符
const dbCmd = db.command
exports.main = async (event, context) => {

	const {
		user_id, //用户id 
		article_id, //文章id
		content //评论内容
	} = event
	
	let userinfo = await db.collection('user').doc(user_id).get()
	// 获取用户对象
	userinfo = userinfo.data[0]
	
	// comment这个字段在某个记录里面,不会生成id,只能在下面随机生成一个
	let commentObj = {
		comment_id: getID(5), //评论id
		comment_content: content, //评论内容
		create_time: new Date().getTime(), //创建时间
		author: {
			author_id: userinfo._id, // 作者id
			author_name: userinfo.author_name, // 作者名称
			avatar: userinfo.avatar, // 作者头像
			professional: userinfo.professional // 专业
		},
		replys: []
	}
	
	await db.collection('article').doc(article_id).update({
		comments: dbCmd.unshift(commentObj)
	})
	
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据更新成功'
	}
};


function getID(length) {
	return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36)
}