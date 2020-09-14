<template>
	<view class="article-list">
				<view v-for="(item, index) in articleList" :key="index" class="article-list-content">
					<navigator v-if="author_show" :url="'/pages/user/user?id='+ item.user_id" open-type="navigate" hover-class="none">
						<view class="author">
							<img :src="item.avatar" class="avatar">
							<text class="author-name">{{item.realName}}</text>
						</view>
					</navigator>
					<navigator :url="'/pages/article_detail/detail?articleId='+ item.article_id" open-type="navigate" hover-class="none">
						<view class="articel-introduce clearfix">
							<view class="introduce-left" :class="{'hasImg': item.article_img}">
								<view class="article-title">{{item.article_title}}</view>
								<view class="article-abstract">{{item.article_abstract || item.article_content}}</view>
							</view>
							<view class="introduce-right" v-if="item.article_img">
								<img :src="item.article_img" class="article-img">
							</view>
						</view>
					</navigator>
					<view class="article-footer">
						<view class="message-num">
							<text class="iconfont icon-message"></text>
							<text class="text">{{item.comments_num}}</text>
						</view>
						<view class="like-num">
							<text class="iconfont icon-like"></text>
							<text class="text">{{item.article_like_num}}</text>
						</view>
					</view>
				</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			articleList: {
			  type: Array,
			  default: []
			},
			author_show: {
				type: Boolean,
				default: true
			}
		},
		components: {
		},
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss" scoped>
	.article-list {
		width: 100%;
	}
	.article-list-content {
		width: 100%;
		text-align: left;
		border-bottom: 1px solid #ddd;
		padding: 40rpx 15rpx;
		.author {
			padding: 5rpx 0 20rpx;
			.avatar {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				vertical-align: middle;
			}
			.author-name {
				color: #333333;
				margin-left: 10rpx;
				font-size: 26rpx;
			}
		}
		.articel-introduce {
			position: relative;
			.hasImg {
				padding-right: 250rpx;
			}
			.introduce-left {
				display: inline-block;
				vertical-align: top;
				.article-title {
					font-size: 35rpx;
					color: #333333;
					font-weight: 500;
				}
				.article-abstract {
					font-size: 26rpx;
					color: #908b8b;
					margin-top: 15rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			.introduce-right {
				position: absolute;
				right: 0;
				top: 80rpx;
				transform: translate(0,-50%);
				.article-img {
					width: 200rpx;
					height: 150rpx;
				}
			}
		}
		.article-footer {
			color: #ddd;
			margin-top: 15rpx;
			font-size: 25rpx!important;
			.message-num {
				display: inline-block;
			}
			.like-num {
				display: inline-block;
				margin-left: 10rpx;
			}
			.text {
				margin-left: 5rpx;
			}
		}
	}
</style>
