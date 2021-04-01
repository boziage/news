<template>
	<view class="comments-box">
		<view class="comments-header">
			<view class="comments-header_logo">
				<image :src="comments.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comments-header_info">
				<view v-if="!comments.isReply" class="title">{{comments.author.author_name}}</view>
				<view v-else class="title">{{comments.author.author_name}}<text class="reply-text">回复</text><text>{{comments.to}}</text></view>
				<view>{{comments.create_time | parseTime}}</view>
			</view>
		</view>
		<view class="comment-content">
			<view>{{comments.comment_content}}</view>
			<view class="comments-info">
				<view class="comments-button" @click="commentsReply({comments,isReply:reply})">回复</view>
			</view>
			<view class="comments-reply" v-for="item in comments.replys" :key="item.comment_id">
				<comments-box :reply="true" :comments="item" @reply="commentsReply"></comments-box>
			</view>
		</view>
	</view>
</template>

<script>
	import componentsBox from '@/components/comments-box/comments-box.vue'
	import {parseTime} from "@/common/utils"
	
	export default {
		name:"comments-box",
		components: {
			componentsBox,
		},
		props: {
			comments: {
				type: Object,
				default() {
					return {}
				}
			},
			reply: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		filters: {
			parseTime(time) {
				return parseTime(time)
			}
		},
		methods: {
			commentsReply(comment) {
				// 区分主回复还是子回复
				if(comment.isReply) {
					comment.comments.reply_id = comment.comments.comment_id
					comment.comments.comment_id = this.comments.comment_id
				}
				// console.log(comment);
				this.$emit('reply', comment)
			},
		},
	}
</script>

<style lang="scss">
	.comments-box {
		margin: 15px 0;
		.comments-header {
			display: flex;
			align-items: center;
			.comments-header_logo {
				flex-shrink: 0;
				// align-items: center;
				
				width: 30px;
				height: 30px;
				border-radius: 5px;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.comments-header_info {
				display: flex;
				flex-direction: column;
				padding-left: 15px;
				font-size: 12px;
				color: #999;
				line-height: 1;
				.title {
					margin-bottom: 10px;
					font-size: 14px;
					color: #333;
					.reply-text {
						margin: 0 10px;
						font-weight: 700;
						color: #000;
					}
				}
			}
		}
		.comment-content {
			margin-top: 10px;
			font-size: 14px;
			color: #000;
			.comments-info {
				margin-top: 15px;
				display: flex;
				.comments-button {
					padding: 2px 10px;
					font-size: 12px;
					color: #999;
					border: 1px solid #999;
					border-radius: 20px;
				}
			}
			.comments-reply {
				display: flex;
				margin: 15px 0;
				padding: 0 10px;
				border: 1px solid #eee;
				box-shadow: 0 1px 5px rgba($color: #000000, $alpha: 0.3);
				border-radius: 5px;
			}
		}
	}
</style>
