<template>
	<view class="home">
		<!-- navbar与home-search组件间的双向绑定,父组件的v-model指令所绑定的属性value通过model选项传递给子组件的val属性，子组件通过自定义事件改变父组件的value属性
			v-model = :value + @input
		-->
		<navbar :isSearch="true" v-model="value" @input="change"></navbar>
		<view class="home-list">
			
			<view v-if="isHistory" class="label-box">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<text class="label-clear" @click="clear">清空</text>
				</view>
				
				<!-- 搜索历史 -->
				<view v-if="historyLists.length > 0" class="label-content">
					<view v-for="(item,index) in historyLists" :key="index" class="label-content_item" @click="openHistory(item)">
						{{item.name}}
					</view>
				</view>
				<view v-else class="no-data">
					没有搜索历史
				</view>
			</view>
			
			<!-- 搜索结果 -->
			<list-scroll v-else class="list-scroll">
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="searchList.length > 0">
					<list-card :item="item" @cardClick="setHistory"
					 v-for="item in searchList" :key="item._id"></list-card>
				</view>
				<view v-if="searchList.length === 0 && !loading" class="no-data">
					没有搜索到相关数据
				</view>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	
	export default {
		data() {
			return {
				value: '',
				isHistory: true,
				searchList: [],
				loading: false
			}
		},
		computed: {
			...mapState(['historyLists'])
		},
		onLoad() {
			
		},
		methods: {
			openHistory(item) {
				this.value = item.name
				this.getSearch(this.value)
				this.$store.dispatch('set_history', {
					name: this.value
				})
			},
			
			setHistory() {
				this.$store.dispatch('set_history', {
					name: this.value
				})
			},
			
			change(value) {
				if(!value){
					clearTimeout(this.timer)
					this.mark = false
					this.getSearch(value)
					return
				}
				// 做标记
				if(!this.mark){
					this.mark = true
					this.timer = setTimeout(() => {
						this.mark = false
						this.getSearch(value)
					}, 1000);	
				}
			},
			
			clear() {
				this.$store.dispatch('clear_history')
				uni.showToast({
					title: "清空完成"
				})
			},
			
			getSearch(value) {
				if(!value){
					this.searchList = []
					this.isHistory = true
					return
				}
				this.isHistory = false
				this.loading = true
				this.$api.get_search({
					value
					}).then(res => {
					const {
						data
					} = res
					console.log(res);
					this.searchList = data
					this.loading = false
				}).catch(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		background-color: #f5f5f5;
	}
	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		// border: 1px solid red;
		.label-box {
			background-color: #fff;
			margin-bottom: 10px;
			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px solid #f5f5f5;
				.label-title {
					color: $mk-base-color;
				}
				.label-clear {
					color: #30b33a;
					font-weight: 700;
				}
			}
			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 0 15px 15px;
				.label-content_item {
					padding: 2px 10px;
					margin-top: 12px;
					margin-right: 10px;
					
					border: 1px solid #666;
					border-radius: 5px;
					
					font-size: 14px;
					color: #666;
				}
			}
		}
		.no-data {
			height: 200px;
			line-height: 200px;
			text-align: center;
			width: 100%;
			color: #666;
			font-size: 12px;
		}
	}
</style>
