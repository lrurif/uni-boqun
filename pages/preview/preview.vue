<template>
	<view>
		<view class="article_preview">
			<h1 class="article_title">{{write_title}}</h1>
			<view class="author">
				<img class="author-avatar" :src="author_avatar">
				<text class="author-name">{{author_name}}</text>
			</view>
			<view style="height: 20rpx;background-color: #f7f5f5;margin-bottom: 20rpx;width: 100vw;margin-left: -15rpx;"></view>
			<rich-text class="show-html" :nodes="write_content"></rich-text>
			
		</view>
		<button @click="publish" type="primary" class="publish-btn">发布</button>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {publishArticle} from "@/api/article.js"
	export default {
		onLoad() {
			this.write_content = uni.getStorageSync("write-content")
			this.write_title = uni.getStorageSync("write-title")
			this.write_cover = uni.getStorageSync("write-cover")
			this.author_name = uni.getStorageSync("userName");
			this.author_avatar = uni.getStorageSync("avatarUrl");
			this.write_content = this.write_content.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
		},
		data() {
			return {
				write_title: "",
				write_cover: "",
				write_content: "",
				author_name: "",
				author_avatar: "",
				canPublish: true
			}
		},
		methods: {
			publish() {
				if(!this.canPublish) return;
				this.canPublish = false;
				publishArticle({
					userId: uni.getStorageSync("userId"),
					title: this.write_title,
					img: this.write_cover,
					content: this.write_content,
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
					
					
				})
			}
		}
		
	}
</script>

<style lang="scss">
	.article_preview {
		padding: 30rpx 15rpx;
		padding-bottom: 100rpx;
		.article_title {
			font-size: 50rpx;
			font-weight: 600;
			color: #333;
		}
		.author {
			margin-top: 25rpx;
			margin-bottom: 20rpx;
			.author-avatar {
				width: 74rpx;
				height: 74rpx;
				border-radius: 50%;
				vertical-align: middle;
			}
			.author-name {
				font-size: 30rpx;
				font-weight: 700;
				color: #333;
				margin-left: 15rpx;
			}
			.focus-author {
				padding: 10rpx 20rpx;
				border: 1px solid #42c02e;
				color: #42c02e;
				border-radius: 5rpx;
				float: right;
			}
		}
	}
	.publish-btn {
		border-radius: 0;
		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>
