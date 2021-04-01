<template>
	<view>
		<uni-load-more v-if="lists.length === 0" status="loading"></uni-load-more>
		<list-card v-if="lists.length > 0" v-for="item in lists" :key="item.id" types="follow" :item="item"></list-card>
		<view v-if="!load && lists.length === 0" class="no-data">
			您还没发布过文章！
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists: [],
				load: true
			};
		},
		onLoad() {
			this.getMyArticle()
		},
		methods: {
			getMyArticle() {
				this.$api.get_my_article().then(res => {
					console.log(res);
					const {data} = res
					this.lists = data
					this.load = !this.load
				})
			}
		},
	}
</script>

<style lang="scss">

</style>
