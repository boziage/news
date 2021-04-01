<template>
	<view>
		<!-- popup在uni里面不能在原生组件用 -->
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header_item" @click="close">取消</text>
					<text class="popup-header_item" @click="submit">发布</text>
				</view>
				<view class="popup-content">
					<textarea class="popup-textarea" v-model="commentValue" maxlength="200" fixed placeholder="请输入评论内容" />
					<view class="popup-count">
						{{commentValue.length}}/200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"release",
		data() {
			return {
				// 输入框的值
				commentValue: '',
			};
		},
		methods: {
			// 打开评论发布窗口
			open() {
				this.$refs.popup.open()
			},
			// 关闭评论发布窗口
			close() {
				this.$refs.popup.close()
			},
			// 提交评论发布窗口
			submit() {
				console.log('发布')
				if(!this.commentValue) {
					uni.showToast({
						title: '请输入评论内容',
						icon:"none"
					})
					return
				}
				this.$emit('submitComment',this.commentValue)
			},
		}
	}
</script>

<style lang="scss">
	.popup-wrap {
		background-color: #fff;
		.popup-header {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #666;
			border-bottom: 1px solid #f5f5f5;
			.popup-header_item {
				height: 50px;
				line-height: 50px;
				padding: 0 15px;
			}
		}
		.popup-content {
			width: 100%;
			padding: 15px;
			box-sizing: border-box;
			.popup-textarea {
				width: 100%;
				height: 200px;
			}
			.popup-count {
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				color: #999;
			}
		}
	}
</style>
