'use strict';
const db = uniCloud.database()
// 聚合操作符
const $ = db.command.aggregate
// 查询条件操作符
const dbCmd = db.command
exports.main = async (event, context) => {

	const {
		user_id, // 用户id
		article_id, // 文章id
		content, // 评论内容
		comment_id = '', // 评论id
		reply_id = "", // 子回复id
		isReply = false //是否子回复
	} = event
	
	let userinfo = await db.collection('user').doc(user_id).get()
	// 获取用户对象
	userinfo = userinfo.data[0]
	// 获取当前的文章信息
	const article = await db.collection('article').doc(article_id).get()
	// 获取文章下的所有评论,因为get()获取的永远是个数组,所以要这样
	const comments = article.data[0].comments
	
	// comment这个字段在某个记录里面,不会生成id,只能在下面随机生成一个
	let commentObj = {
		comment_id: getID(5), //评论id
		comment_content: content, //评论内容
		create_time: new Date().getTime(), //创建时间
		isReply: isReply,//区分主回复还是子回复
		author: {
			author_id: userinfo._id, // 作者id
			author_name: userinfo.author_name, // 作者名称
			avatar: userinfo.avatar, // 作者头像
			professional: userinfo.professional // 专业
		},
		replys: []
	}
	
	if(comment_id === ''){
		// 评论文章
		commentObj.replys = []
		commentObj = dbCmd.unshift(commentObj)
	}else{
		// 回复对评论的评论
		// 获取评论索引
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id)
		
		
		let commentAuthor = ''
		if(isReply) {
			// 子回复
			commentAuthor = comments[commentIndex].replys.find(item => comment_id === comment_id)
		}else{
			// 主回复
			// 获取作者信息
			commentAuthor = comments.find(item => item.comment_id === comment_id)
		}
		commentAuthor = commentAuthor.author.author_name
		commentObj.to = commentAuthor
		
		// 更新回复信息
		commentObj = {
			[commentIndex]: {
				replys: dbCmd.unshift(commentObj)
			}
		}
		
		/* 
			let obj = {
				arr:[{name:1}, {name:2}]
			}
			xxx.update({
				arr: {
				//下标	
					1: {
						name:3
					}
				}
			})
			
		 */
	}
	
	await db.collection('article').doc(article_id).update({
		comments: commentObj
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