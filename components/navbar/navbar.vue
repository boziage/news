<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height:statusBarHeight + 'px'}"></view>
			<!-- 导航栏 -->
			<view class="navbar-content" :class="{search: isSearch}" :style="{height:navBarHeight 
			+ 'px',width:windowWidth + 'px'}"
			 @click.stop="navbarClick">
			 
				<view v-if="isSearch" class="navbar-content-search_icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				
				<view v-if="!isSearch" class="navbar-search">
					<!-- 非搜索页显示 -->
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">uni-app、vue</view>
				</view>
				
				<view v-else class="navbar-search">
					<!-- 搜索页显示 -->
					<input class="navbar-search_text" type="text" placeholder="请输入您要搜索的内容"
					 v-model="val" @input="inputChange"/>
				</view>
			</view>
		</view>
		<!-- 用来占据fixed布局的地方,让第一行能看得到 -->
		<view :style="{height:statusBarHeight + navBarHeight + 'px'}"></view>
	</view>
</template>

<script>
	
	export default {
		name:"navbar",
		props: {
			value: {
				type:[String, Number],
				default: ''
			},
			isSearch: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 45,
				windowWidth: 375,
				val:'',
			};
		},
		watch: {
			value(newValue) {
				this.val = newValue
			}
		},
		created() {
			// 获取手机系统信息
			const info = uni.getSystemInfoSync()
			// console.log(info);
			// 设置状态栏高度
			this.statusBarHeight = info.statusBarHeight
			// 设置导航栏宽度
			this.windowWidth = info.windowWidth
			
			
			// 除h5 app mp-alipay代码
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			// 获取胶囊的位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			console.log(menuButtonInfo);
			// (胶囊底部高度 - 状态栏高度) + (胶囊顶部高度 - 状态栏高度)
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight)
			 + (menuButtonInfo.top - info.statusBarHeight)
			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods: {
			back() {
				// H5的原因，刷新之后重置？没有上一页了
				// uni.navigateBack()
				uni.switchTab({
					url:'/pages/tabbar/index/index'
				})
			},
			navbarClick() {
				if(this.isSearch) return
				uni.navigateTo({
					url:"/pages/home-search/home-search"
				})
			},
			inputChange(e) {
				const {value} = e.detail
				// let value = e.target.value
				this.$emit('input', value)
			}
		},
	}
</script>

<style lang="scss">	
	.navbar-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;

		width: 100%;
		background-color: $mk-base-color;
		.navbar-content {
			display: flex;
			justify-content: center;
			align-items: center;
			
			box-sizing: border-box;
			padding: 0 15px;
			.navbar-search {
				display: flex;
				align-items: center;
				
				padding: 0 10px;
				width: 100%;
				height: 30px;
				background-color: #fff;
				border-radius: 30px;
				.navbar-search_icon {
					// width: 10px;
					// height: 10px;
					margin-right: 10px;
				}
				.navbar-search_text {
					width: 100%;
					font-size: 14px;
					line-height: 30px;
					color: #999;
				}
			}
			&.search {
				padding-left: 0;
				.navbar-content-search_icons {
					margin:0 10px;
					// display: flex;	
				}
				.navbar-search {
					border-radius: 5px;
				}
			}
		}
		
	}
</style>
