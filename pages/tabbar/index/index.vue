<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		<navbar></navbar>
		<tab :list="tabList" :tabIndex="tabIndex" @tabClick="tabClick"></tab>
		<view class="home-list">
			<list :tab="tabList" :listIndex="tabIndex" @change="change"></list>
		</view>
	</view>
</template>

<script>
	// easyCom components/组件名/组件名.vue 局部引入，与以前import不太一样
	
	export default {
		data() {
			return {
				tabList: [],
				tabIndex: 0,
			}
		},
		onLoad() {
			uni.$on('labelChange', res => {
				// this.tabList = []
				// this.tabIndex = 0
				this.getLabel()
			})
			this.getLabel()
		},
		methods: {
			getLabel() {
			// $http > list(导出各种请求，在这里维护,将promise方法封装到$http中共用) > index(list的集合（中转站）,并批量导出（利用require.context + Object.assign）) > Vue.prototype.$api(注册全局变量,便于随时请求,不用import)
			this.$api.get_label().then(res => {
				const {
					data
				} = res
				data.unshift({
					name: '全部'
				})
				this.tabList = data
				})
			},
			tabClick({index}) {
				this.tabIndex = index
			},
			change(current) {
				this.tabIndex = current
			}
		},
	}
	
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		.home {
			display: flex;
			flex-direction: column;
			flex: 1;
			
			overflow: hidden;
			// border: 1px solid red;
			.home-list {
				flex: 1;
				
				box-sizing: border-box;
				// border: 1px solid red;
			}
		}
	}
</style>
