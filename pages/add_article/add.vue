<template>
	<view>
		<view class="add-article">
			<input type="text" placeholder="点击输入标题" v-model="article_title" class="article-title">
			<view class="cover" @click="choseImg">
				<view class="cover-btn" v-if="!cover_img" >
					<u-icon name = "plus"></u-icon>
					<view class="add-cover">添加封面</view>
				</view>
				<img :src="cover_img" class="cover-img" v-else>
			</view>
			<!-- <editor placeholder="123"></editor> -->
			<jinEdit ref="editor" :title="article_title" class="editor" placeholder="请输入内容" @editOk="editOk" uploadFileUrl="http://101.201.152.125:3000/upload/single" fileKeyName="imageFile"></jinEdit>
			<button type="primary" class="preview-btn" @click="preview">预览</button>
		</view>
		<u-toast ref="uToast" />
	</view>
	
</template>

<script>
	import jinEdit from "../../components/jin-edit/jin-edit.vue"
	import {publishArticle} from "@/api/article.js"
	export default {
		data() {
			return {
				placeholder: '开始输入...',
				cover_img: "",
				article_title: ""
			}
		},
		components: {
			jinEdit
		},
		methods: {
			// 点击发布
			editOk(res) {
			    console.log(res);
				publishArticle({
					userId: uni.getStorageSync("userId"),
					title: this.article_title,
					img: this.cover_img,
					content: res.html,
					abstract: ""
				}).then(res=> {
					this.$refs.uToast.show({
						title: '发布文章成功',
						type: 'success',
						callback() {
							uni.switchTab({
								url: "/pages/home/home",
								success() {
								},
								fail() {
								}
							})
						},
						duration: 500
					});
					console.log(res);
				})
			},
			// 选择封面图片
			choseImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: async(res) => {
						var tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '正在上传中...'
						})
						for (let temp of tempFilePaths) {
							// 图片上传服务器
							await uni.uploadFile({
								url: 'http://101.201.152.125:3000/upload/single',
								filePath: temp,
								name: "imageFile",
								success: res => {
									// 上传完成后处理
									this.cover_img = JSON.parse(res.data).path;
									uni.hideLoading()
								},
								
							});
						}
					}
				})
			},
			preview() {
				let that = this;
				if(this.article_title.length === 0) {
					this.$refs.uToast.show({
						title: '文章标题不能为空！',
						type: 'warning',
					})
					return;
				}
				this.$refs.editor.editorCtx.getContents({
					success(editor_res) {
						let reg=/<[^>]+>/gim;
						if(editor_res.html.replace(reg, "") === "") {
							that.$refs.uToast.show({
								title: '文章内容不能为空！',
								type: 'warning',
							})
							return;
						}
						new Promise((resolve, reject)=> {
							uni.setStorage({
								key: "write-title",
								data: that.article_title,
								success() {
									resolve();
								}
							})
						}).then(res=> {
							return new Promise((resolve, reject)=> {
								uni.setStorage({
									key: "write-content",
									data: editor_res.html,
									success() {
										resolve();
									}
								})
							})
						}).then(res=> {
							return new Promise((resolve, reject)=> {
								uni.setStorage({
									key: "write-cover",
									data: that.cover_img,
									success() {
										uni.navigateTo({
											url:"/pages/preview/preview"
										})
										resolve();
									}
								})
							})
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.add-article {
		padding: 20rpx;
		position: relative;
		.article-title {
			border: 1px solid #ddd;
			padding: 10rpx 20rpx;
			// width: 90%;
			border-radius: 10rpx;
			font-size: 34rpx;
		}
		.cover {
			margin-top: 20rpx;
			position: relative;
			height: 150rpx;
			width: 150rpx;
			.cover-btn {
				text-align: center;
				font-size: 40rpx;
				width: 150rpx;
				height: 150rpx;
				border: 1px solid #ddd;
				color: #ddd;
				// line-height: 150rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				position: absolute;
				left: 0;
				top: 0;
			}
			.cover-img {
				width: 150rpx;
				height: 150rpx;
				position: absolute;
				left: 0;
				top: 0;
			}
			.add-cover {
				font-size: 28rpx;
			}
				
		}
		.editor {
			// border: 1px solid #ddd;
		}
		.preview-btn {
			margin-bottom: 190rpx;
			z-index: 0;
		}
	}
</style>
