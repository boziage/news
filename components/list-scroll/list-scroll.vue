<template>
	<view class="scroll">
		<scroll-view class="list-scroll" scroll-y @scrolltolower="loadMore">
			<view>
				<slot></slot>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"listScroll",
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

<style lang="scss">
	.scroll {
		flex: 1;
		// scroll需要高度
		overflow: hidden;
		height: 100%;
		box-sizing: border-box;
		.list-scroll {
			height: 100%;
		}
	}
</style>
