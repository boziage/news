<template>
	<view class="follow">
		<!-- 导航切换 -->
		<view class="follow-tab">
			<view class="follow-tab_box">
				<view class="follow-tab_item" :class="{active:currentIndex === 0}" @click="tab(0)">文章</view>
				<view class="follow-tab_item" :class="{active:currentIndex === 1}" @click="tab(1)">作者</view>
			</view>
		</view>
		<view class="follow-list">
			<swiper class="follow-list_swiper" :current="currentIndex" @change="change">
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="list.length === 0 && !articleShow" status="loading" iconType="snow"></uni-load-more>
						<list-card v-for="item in list" :key="item.id" types="follow" :item="item"></list-card>
						<view class="no-data" v-if="articleShow">没有数据</view>
					</list-scroll>
				</swiper-item>
				<swiper-item>
					<list-scroll>
						<list-author v-for="item in authorLists" :key="item.id" :item="item"></list-author>
					</list-scroll>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex: 0,
				list: [],
				articleShow: false,
				authorLists: []
			};
		},
		onLoad() {
			// 自定义事件，$on 只能在打开的页面触发
			uni.$on('update_article', () => {
				console.log('关注页面触发');
				this.getFollow()
			})
			uni.$on('update_author', () => {
				this.getAuthor()
			})
			this.getFollow()
			this.getAuthor()
		},
		methods: {
			change(e) {
				this.currentIndex = e.detail.current
			},
			tab(index) {
				this.currentIndex = index
			},
			getFollow() {
				this.$api.get_follow().then(res => {
					const {data} = res
					this.list = data
					this.articleShow = this.list.length === 0 ? true:false
				})
			},
			getAuthor() {
				this.$api.get_author().then(res => {
					console.log(res);
					const {data} = res
					this.authorLists = data
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}
	.follow {
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
		// 
		box-sizing: border-box;
		.follow-tab {
			height: 30px;
			padding: 10px 20px;
			border-bottom: 1px solid #f5f5f5;
			.follow-tab_box {
				display: flex;
				width: 100%;
				height: 100%;
				border: 1px solid $mk-base-color;
				border-radius: 5px;
				.follow-tab_item {
					width: 100%;
					height: 100%;
					line-height: 30px;
					
					font-size: 14px;
					text-align: center;
					justify-content: center;
					&:first-child {
						border-right: 1px solid $mk-base-color;
					}
					&.active {
						color: $mk-base-color;
					}
				}
			}
		}
		.follow-list {
			flex: 1;
			// border: 1px solid red;
			.follow-list_swiper {
				height: 100%;
				.swiper-item {
					height: 100%;
				}
			}
		}
	}
	.no-data {
		padding: 50px;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
</style>
