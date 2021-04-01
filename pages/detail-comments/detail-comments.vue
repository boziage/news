<template>
	<view>
		<view v-for="item in commentsList" :key="item.comments_id" class="comments-content">
			<comments-box :comments="item" @reply="reply"></comments-box>
		</view>
		<uni-load-more v-if="commentsList.length === 0 || commentsList.length >= this.pageSize"
		 iconType="snow" :status="loading"></uni-load-more>
		 <release ref="popup" @submitComment="submitComment"></release>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentsList: [],
				article_id: '',
				page: 1,
				pageSize: 5,
				loading: 'loading'
			};
		},
		onLoad(query) {
			this.article_id = query.id
			// console.log(query);
			this.getComments()
		},
		onReachBottom() {
			if(this.loading === 'noMore') return
			this.page++
			this.getComments()
			console.log('--上拉触底');
		},
		methods: {
			getComments() {
				this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize,
				}).then(res => {
					const {data} = res
					if(data.length === 0) {
						this.loading = 'noMore'
						return
					}
					let oldFormData = JSON.parse(JSON.stringify(this.commentsList))
					oldFormData.push(...data)
					console.log(res);
					this.commentsList = oldFormData
				})
			},
			// 更新评论
			setUpdateComment(content) {
				console.log(content);
				const formdata = {
					article_id: this.article_id,
					...content
				}
				// 数据重置，避免key重复，添加重复数据
				this.commentsList =  []
				this.page = 1 
				this.loading = 'loading'
				uni.showLoading()
				this.$api.update_comment(formdata).then(res => {
					console.log(res);
					uni.hideLoading()
					uni.showToast({
						title: '评论成功',
						icon: 'none'
					})
					this.$refs.popup.commentValue = ''
					this.getComments()
					this.closeComment()
					this.replyFormData = {}
					uni.$emit('getComments')
				})
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
			submitComment(content) {
				this.setUpdateComment({content,...this.replyFormData})
			},
		},
	}
</script>

<style lang="scss">
	.comments-content {
		padding: 0 15px;
		border-top: 1px solid #ccc;
	}
</style>
