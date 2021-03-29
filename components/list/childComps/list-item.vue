<template>
	<list-scroll class="list-scroll" @loadMore="loadMore">
		<list-card :item="item" v-for="item in list" :key="item._id"></list-card>
		<uni-load-more v-if="list.length === 0 || list.length >= pageSize" iconType="snow" :status="load.loading"></uni-load-more>
	</list-scroll>
</template>

<script>
	export default {
		name:"list-item",
		props: {
			// list是分页的卡片数据
			list: {
				type: Array,
				default() {
					return []
				}
			// load是当前分页页码和加载的数据
			},
			load: {
				type: Object,
				default() {
					return {
						loading: 'loading'
					}
				}
			},
			pageSize: {
				type: Number,
				default: 8
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			loadMore() {
				this.$emit('loadMore')
			}
		}
	}
</script>

<style>
	.list-scroll {
		height: 100%;
		/* overflow: hidden; */
	}
</style>
