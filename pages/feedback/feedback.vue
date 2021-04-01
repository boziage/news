<template>
	<view>
		<view class="feedback-title">意见反馈:</view>
		<view class="feedback-content">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入您要反馈的问题" />
		</view>
		<view class="feedback-title">反馈图片(六张上限):</view>
		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item, index) in imageLists" :key="item.id">
				<view class="close-icon" @click="del(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode=""></image>
				</view>
			</view>
			<view v-if="imageLists.length < 6" class="feedback-image-item" @click="addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<button class="feedback-button" type="primary" @click="submit">提交反馈意见</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				feedBackImages:[],
				imageLists: []
			};
		},
		methods: {
			addImage() {
				const count = 6 - this.imageLists.length
				uni.chooseImage({
					// H5不支持count这个字段,H5只能选择一张或者多张
					count: count,
					// 改变this指向
					success: res => {
						const tempfilepaths = res.tempFilePaths
						const tempFiles = res.tempFiles
						tempfilepaths.forEach((item, index) => {
							// 处理H5多选的状况
							if(index < count){
								this.imageLists.push({
									url: item,
									name: tempFiles[index].name
								})
							}
						})
						// console.log(res);
					}
				})
			},
			del(index) {
				this.imageLists.splice(index, 1)
			},
			async submit() {
				if(!this.content){
					uni.showToast({
						title:'请输入反馈内容!',
						icon:'none'
					})
					return
				}
				let imagesPath = []
				uni.showLoading()
				// 上传图片的API每次只能一张,不支持多图上传,不用foreach等,我们用的是同步的方法,不然不知道是哪一张
				for(let i = 0; i < this.imageLists.length ;i++){
					let file = this.imageLists[i]
					file = await this.uploadFiles(file)
					imagesPath.push(file)
				}
				// console.log(imagesPath);
				this.updateFeedback({
					content: this.content,
					feedBackImages: imagesPath
				})
			},
			async uploadFiles(file) {
				const result = await uniCloud.uploadFile({
					filePath: file.url,
					cloudPath: file.name
				})
				// console.log(result);
				return result.fileID
			},
			updateFeedback({content, feedBackImages}) {
				this.$api.update_feedback({content, feedBackImages}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title:"反馈提交成功",
					})
					setTimeout(() => {
						uni.switchTab({
							url:'/pages/tabbar/my/my'
						})
					}, 2000)
					
				}).catch(() => {
					uni.hideLoading()
					uni.showToast({
						title:"反馈提交失败",
						icon:"none"
					})
				})
			}
		},
	}
</script>

<style lang="scss">
	.feedback-title {
		margin: 15px 15px 0;
		font-size: 14px;
		color: #666;
	}
	.feedback-content {
		margin: 15px;
		padding: 10px;
		box-sizing: border-box;
		border: 1px solid #eee;
		.feedback-textarea {
			font-size: 12px;
			width: 100%;
			height: 100px;
		}
	}
	.feedback-image-box {
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		.feedback-image-item {
			position: relative;
			width: 33.33%;
			// 为了方形显示
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;
			// border: 1px solid red;
			.close-icon {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 22px;
				height: 22px;
				border-radius: 50%;
				background-color: #ff5a5f;
				z-index: 2;
			}
			.image-box {
				display: flex;
				justify-content: center;
				align-items: center;
				
				position: absolute;
				top: 5px;
				right: 5px;
				bottom: 5px;
				left: 5px;
				
				border: 1px solid #eee;
				border-radius: 5px;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.feedback-button {
		margin: 0 15px;
		background-color: $mk-base-color;
	}
</style>
