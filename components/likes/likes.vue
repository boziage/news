<template>
	<!-- 记得阻止冒泡事件 -->
	<view class="icons" @click.stop="likeTap">
		<uni-icons size="20" color="#f07373" :type="isLike?'heart-filled':'heart'"></uni-icons>
	</view>
</template>

<script>
	export default {
		name:"likes",
		props: {
			item: {
				tyoe: Object,
				default() {
					return {}
				}
			},
		},
		data() {
			return {
				isLike: false
			}
		},
		watch: {
			item(newValue) {
				this.isLike = this.item.is_like
			}
		},
		created() {
			this.isLike = this.item.is_like
		},
		methods: {
			likeTap() {
				this.isLike = !this.isLike
				this.setUpdateLikes()
			},
			setUpdateLikes(){
				uni.showLoading({
					
				})
				this.$api.update_like({
					user_id: '605c310f99548d000188b0e4',
					article_id: this.item._id
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: this.isLike?'收藏成功':'取消收藏',
						icon:'none'
					})
					console.log(res)
				}).catch(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	.icons {
		position: absolute;
		right: 0;
		top: 0;
		
		display: flex;
		justify-content: center;
		align-items: center;
		height: 20px;
		width: 20px;
	}
</style>
