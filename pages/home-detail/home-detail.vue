<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		
		<view class="detail-header">
			<view class="detail-header_logo"><image :src="formData.author.avatar" mode="aspectFill"></image></view>
			<view class="detail-header_content">
				<view class="detail-header_content-title">{{formData.author.author_name}}</view>
				<view class="detail-header_content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<!-- get_detail里面有是否关注作者的key -->
			<button class="detail-header_button" type="default" @click="follow(formData.author.id)">{{formData.is_author_like?'取消关注':'关注'}}</button>
		</view>
		
		<view class="detail-content">
			<view class="detail-html">
				<!-- <u-parse :content="formData.content" :noData="noData"></u-parse> -->
				内容
			</view>
			
			 <view class="detail-comment">
			 	<view class="comment-title">最新评论</view>
			 	<view v-for="item in commentsList" :key="item.comment_id" class="comment-content">
					<comments-box :comments="item" @reply="reply"></comments-box>
				</view>
			 </view>
		</view>
		
		<view class="detail-buttom">
			<view class="detail-buttom_input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-buttom_icons">
				<view class="detail-buttom_icons-box" @click="open">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<!-- get_detail里面有是否收藏的key -->
				<view class="detail-buttom_icons-box" @click="likeTap(formData._id)">
					<uni-icons :type="formData.is_like?'heart-filled':'heart'" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-buttom_icons-box" @click="thumbsup(formData._id)">
					<uni-icons :type="formData.is_thumbs_up?'hand-thumbsup-filled':'hand-thumbsup'" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- popup在uni里面不能在原生组件用 -->
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header_item" @click="closeComment">取消</text>
					<text class="popup-header_item" @click="submitComment">发布</text>
				</view>
				<view class="popup-content">
					<textarea class="popup-textarea" v-model="commentValue" maxlength="200" fixed placeholder="请输入评论内容" />
					<view class="popup-count">
						{{commentValue.length}}/200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	
	export default {
		components: {
			uParse,
		},
		data() {
			return {
				formData: {},
				noData: '<p style="text-align:center;color:#666">详情加载中...</p>',
				// 输入框的值
				commentValue: '',
				commentsList: [],
				replyFormData: {}
			}
		},
		onLoad(query) {
			const data = JSON.parse(query.params)
			this.formData = data
			this.getDetail()
			this.getComments()
		},
		// onLoad这些节点还没渲染完成,onReady表示所有页面渲染完毕后使用
		onReady() {
			
		},
		methods: {
			// 打开评论列表
			open() {
				uni.navigateTo({
					url:'../detail-comments/detail-comments?id='+this.formData._id
				})
			},
			// 关注
			follow(author_id) {
				// console.log('关注');
				this.setUpdateAuthor(author_id)
			},
			// 收藏
			likeTap(article_id) {
				console.log('收藏文章');
				this.setUpdataLike(article_id)
			},
			// 点赞
			thumbsup(article_id) {
				this.setUpdataThumbs(article_id)
			},


			// 获取详情信息
			getDetail() {
				this.$api.get_detail({
					article_id: this.formData._id
				}).then(res => {
					const {data} = res
					this.formData = data
					console.log(res);
				})
			},
			// 更新评论
			setUpdateComment(content) {
				const formdata = {
					article_id: this.formData._id,
					...content
				}
				uni.showLoading()
				this.$api.update_comment(formdata).then(res => {
					console.log(res);
					uni.hideLoading()
					uni.showToast({
						title: '评论成功',
						icon: 'none'
					})
					this.commentValue = ''
					this.getComments()
					this.closeComment()
					this.replyFormData = {}
				})
			},
			// 请求评论内容
			getComments() {
				this.$api.get_comments({
					article_id: this.formData._id
				}).then(res => {
					console.log(res);
					const {data} = res
					this.commentsList = data
				})
			},
			// 关注作者
			setUpdateAuthor(author_id) {
				uni.showLoading()
				this.$api.update_author({
					author_id,
				}).then(res => {
					uni.hideLoading()
					this.formData.is_author_like = !this.formData.is_author_like
					uni.showToast({
						title:this.formData.is_author_like?'关注作者成功':'取消关注作者',
						icon:'none'
					})
				})
			},
			// 收藏文章
			setUpdataLike(article_id) {
				uni.showLoading()
				this.$api.update_like({
					article_id,
				}).then(res => {
					uni.hideLoading()
					this.formData.is_like = !this.formData.is_like
					uni.$emit('update_article')
					uni.showToast({
						title:this.formData.is_like?'收藏成功':'取消收藏',
						icon:'none'
					})
				})
			},
			// 点赞
			setUpdataThumbs(article_id) {
				uni.showLoading()
				this.$api.update_thumbsup({
					article_id,
				}).then(res => {
					uni.hideLoading()
					if(!this.formData.is_thumbs_up) this.formData.thumbs_up_count++
					this.formData.is_thumbs_up = true
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
				})
			},
			
			
			
			// 打开评论发布窗口
			openComment() {
				this.$refs.popup.open()
			},
			// 关闭评论发布窗口
			closeComment() {
				this.$refs.popup.close()
			},
			// 提交评论发布窗口
			submitComment() {
				console.log('发布')
				if(!this.commentValue) {
					uni.showToast({
						title: '请输入评论内容',
						icon:"none"
					})
					return
				}
				this.setUpdateComment({content:this.commentValue,...this.replyFormData})
			},
			reply(e) {
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"isReply": e.isReply
				}
				if(e.comments.reply_id) {
					this.replyFormData.reply_id = e.comments.reply_id
				}
				console.log(this.replyFormData);
				this.openComment()
				// console.log(this.replyFormData);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding: 15px 0 54px;
	}
	.detail-title {
		padding: 0 15px;
		font-size: 18px;
		font-weight: 700;
		color: #333;
	}
	.detail-header {
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;
		.detail-header_logo {
			flex-shrink: 0;
			
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.detail-header_content {
			width: 100%;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;
			.detail-header_content-title {
				font-size: 14px;
				color: #333;
			}
			.detail-header_content-info {
				color: #999;
				text {
					margin-right: 10px;
				}
			}
		}
		.detail-header_button {
			flex-shrink: 0;
			height: 30px;
			font-size: 12px;
			color: #fff;
			background-color: $mk-base-color;
		}
	}
	.detail-content {
		margin-top: 20px;
		min-height: 500px;
		
		.detail-html {
			padding:0 15px;
		}
		.detail-comment {
			margin-top: 30px;
			.comment-title {
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px solid #f5f5f5;
			}
			.comment-content {
				margin: 7px 5px 0px;
				padding: 0 15px;
				border: 1px solid #ccc;
				box-shadow: 0 0.5px 2px rgba($color: #000000, $alpha: 0.3);
				border-radius: 5px;
			}
		}
	}
	.detail-buttom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		
		background-color: #fff;
		border-top: 1px solid #f5f5f5;
		box-sizing: border-box;
		.detail-buttom_input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			margin-left: 10px;		
			padding: 0 10px;
			width: 100%;
			height: 30px;
			line-height: 30px;
			
			border: 1px solid #ddd;
			border-radius: 5px;
			text {
				font-size: 14px;
				color: #999;
			}
		}
		.detail-buttom_icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;
			.detail-buttom_icons-box {
				display: flex;
				// align-items: center;
				justify-content: center;
				width: 44px;
			}
		}
	}
	.popup-wrap {
		background-color: #fff;
		.popup-header {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #666;
			border-bottom: 1px solid #f5f5f5;
			.popup-header_item {
				height: 50px;
				line-height: 50px;
				padding: 0 15px;
			}
		}
		.popup-content {
			width: 100%;
			padding: 15px;
			box-sizing: border-box;
			.popup-textarea {
				width: 100%;
				height: 200px;
			}
			.popup-count {
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				color: #999;
			}
		}
	}
</style>
