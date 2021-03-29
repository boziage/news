<template>
	<swiper class="home-swiper" :current="listIndex" @change="change">
		<swiper-item v-for="(item, index) in tab" :key="item._id" class="swiper-item">
			<list-item :list="listCatchData[index]" :pageSize="pageSize" :load="load[index]" @loadMore="loadMore"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './childComps/list-item.vue'
	
	export default {
		name:"list",
		components: {
			listItem,
		},
		props: {
			tab: {
				type: Array,
				default() {
					return []
				}
			},
			// 切换tab的时候传的值
			listIndex: {
				type:Number,
				default: 0
			}
		},
		data() {
			return {
				// js 的限制 listCatchData[index] = data 
				// 数组和对象通过索引直接赋值不会触发vue的渲染更新(引用类型,更改后不认为发生了变化,就不会更新)
				listCatchData: {},
				// 对每个页面的page保存
				load: {},
				pageSize: 8
			};
		},
		watch: {
			tab(newValue) {
				if(newValue.length === 0) return
				this.listCatchData = {}
				this.load = {}
				this.getList(this.listIndex)
			}
		},
		// onLoad 在页面,created 组件
		created() {
			// tab还没有赋值
		},
		methods: {
			loadMore() {
				if(this.load[this.listIndex].loading === 'noMore') return
				this.load[this.listIndex].page++
				this.getList(this.listIndex)
			},
			change(e) {
				// current是组件内创造的,由change时间产生,并在index中将listIndex与tabIndex改变
				// listIndex是与tab传递数据的时候创建的,用来联动tab--------listIndex <- current -> tabIndex 
				const {current} = e.detail
				// tab active联动
				this.$emit('change', current)
				// 当数据不存在,或者长度为0的情况下才请求数据,避免多次请求
				if(!this.listCatchData[current] || this.listCatchData[current].length === 0){
					// list 内容切换
					this.getList(current)
				}
			},
			getList(current) {
				if(!this.load[current]) {
					this.load[current] = {
						page: 1,
						loading: 'loading'
					}
				}
				this.$api.get_list({
					name: this.tab[current].name,
					page: this.load[current].page,
					pageSize: this.pageSize
					}).then(res => {
					console.log(res);
					const {
						data
					} = res
					// this.list = data
					if(data.length === 0) {
						let oldLoad = {}
						oldLoad.loading = 'noMore'
						oldLoad.page = this.load[current].page
						this.$set(this.load, current, oldLoad)
						// 强制渲染页面
						this.$forceUpdate()
						return
					}
					
					let oldList = this.listCatchData[current] || []
					oldList.push(...data)
					// 懒加载
					this.$set(this.listCatchData, current, oldList)

					/* this.listCatchData[current] = oldList
					this.listCatchData = {...this.listCatchData} */
				})
			}
		},
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;
		.swiper-item {
			height: 100%;
			overflow: hidden;
			
			.list-scroll{
				height: 100%;
			}
		}
	}
</style>
