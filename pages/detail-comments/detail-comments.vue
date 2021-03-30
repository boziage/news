<template>
	<view>
		<view v-for="item in commentsList" :key="item.comments_id" class="comments-content">
			<comments-box :comments="item"></comments-box>
		</view>
		<uni-load-more v-if="commentsList.length === 0 || commentsList.length >= this.pageSize"
		 iconType="snow" :status="loading"></uni-load-more>
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
		},
	}
</script>

<style lang="scss">
	.comments-content {
		padding: 0 15px;
		border-top: 1px solid #ccc;
	}
</style>
