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
		</view>
		
		<view class="detail-content">
			<view class="detail-html">
				<!-- <u-parse :content="formData.content" :noData="noData"></u-parse> -->
				内容
			</view>
			
			 <view class="detail-comment">
			 	<view class="comment-title">最新评论</view>
			 	<view class="comment-content">
					<comments-box></comments-box>
				</view>
			 </view>
		</view>
		
		<view class="detail-buttom">
			<view class="detail-buttom_input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-buttom_icons">
				<view class="detail-buttom_icons-box">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-buttom_icons-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-buttom_icons-box">
					<uni-icons type="hand-thumbsup" size="22" color="#f07373"></uni-icons>
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
				commentValue: ''
			}
		},
		onLoad(query) {
			this.formData = JSON.parse(query.params)
			this.getDetail()
		},
		// onLoad这些节点还没渲染完成,onReady表示所有页面渲染完毕后使用
		onReady() {
			
		},
		methods: {
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
			// 打开评论发布窗口
			openComment() {
				this.$refs.popup.open()
			},
			closeComment() {
				this.$refs.popup.close()
			},
			submitComment() {
				console.log('发布')
				if(!this.commentValue) {
					uni.showToast({
						title: '请输入评论内容',
						icon:"none"
					})
					return
				}
				this.setUpdateComment(this.commentValue)
			},
			setUpdateComment(content) {
				uni.showLoading()
				this.$api.update_comment({
					article_id: this.formData._id,
					content
				}).then(res => {
					console.log(res);
					uni.hideLoading()
					uni.showToast({
						title: '评论成功',
						icon: 'none'
					})
					this.commentValue = ''
					this.closeComment()
				})
			},
		},
	}
</script>

<style lang="scss">
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
				padding: 0 15px;
				border-top: 1px solid #eee;
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
