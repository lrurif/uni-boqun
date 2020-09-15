<template>
	<view class="detail-main">
		<view class="article_detail">
			<h1 class="article_title">{{article_detail.article_title}}</h1>
			<view class="author">
				<navigator :url="'/pages/user/user?id='+ article_detail.user_id" open-type="navigate" hover-class="none">
					<img class="author-avatar" :src="article_detail.avatar">
					<text class="author-name">{{article_detail.realName}}</text>
				</navigator>
				<text v-if="userId!==article_detail.user_id" @tap="focus_person" class="focus-author" :class="{'isFocus': article_detail.isFocus}">{{article_detail.isFocus?"已关注":"关注"}}</text>
			</view>
			<view class="article-info">
				<text class="article-time">{{article_detail.article_time}}</text>
				<text class="middle-code">·</text>
				<text class="article-read-num">阅读:{{article_detail.article_reading}}</text>
			</view>
			<view style="height: 20rpx;background-color: #f7f5f5;margin-bottom: 20rpx;width: 100vw;margin-left: -15rpx;"></view>
			 <rich-text class="show-html" :nodes="article_detail.article_content"></rich-text>
			 <u-popup v-model="pop_show" mode="top">
				 <view class="pop-content">
					<textarea v-model="comment_value" :placeholder="placeholder" class="comment-input" :focus="true">
					</textarea>
					<view class="comment-btn">
						<button class="cancel" @tap="pop_show = false;">取消</button>
						<button class="confirm" type="primary" @tap="add_comment">确认</button>
					</view>
				 </view>
			 </u-popup>
		</view>
		<view class="comments-area">
			<view class="comment" v-for="(item, index) in comments_arr" :key="index">
				<view class="sender">
					<navigator url="/pages/user/user" open-type="navigate" hover-class="none">
						<view class="sender-left">
							<image class="avatar" :src="item.sender.avatar"></image>
							<text class="real-name">{{item.sender.realName}}</text>
						</view>
					</navigator>
					<view class="sender-right">
						<text @tap="reply_comment(index)" class="iconfont icon-send-message"></text>
						<text @tap="thumpUp(index)" class="iconfont icon-zan" :class="{'isZan': item.isThumbUp}"></text>
						<text :class="{'isZan': item.isThumbUp}">{{item.thumbUpNum}}</text>
					</view>
				</view>
				<view class="comment-content">
					<view>{{item.comment_content}}<text class="comment-data">{{item.comment_time}}</text></view>
				</view>
				<view class="comments-children">
					<view class="comment-child" v-for="(child_item, child_index) in item.children" :key="child_index">
						<view class="sender-child">
							<view class="sender-left-child">
								<navigator style="display: inline-block;" url="/pages/user/user" open-type="navigate" hover-class="none">
									<image class="avatar" :src="child_item.sender.avatar"></image>
									<text class="real-name">{{child_item.sender.realName}}</text>
								</navigator>
								<text>回复</text>
								<text class="receive-name">{{child_item.receiver.realName}}</text>
							</view>
							<view class="sender-right-child">
								<text @tap="reply_comment_child(index, child_index)" class="iconfont icon-send-message"></text>
								<text @tap="thumpUp(index, child_index)" class="iconfont icon-zan" :class="{'isZan': child_item.isThumbUp}"></text>
								<text :class="{'isZan': child_item.isThumbUp}">{{child_item.thumbUpNum}}</text>
							</view>
						</view>
						<view class="comment-content-child">
							<view>{{child_item.comment_content}}<text class="comment-data-child">{{child_item.comment_time}}</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-view">
			<view class="show-popup" @tap="change_pop">
				快来发表评论吧...
			</view>
			<view  class="operate-btn">
				 <text class="zan-btn" @tap="zan">
					 <text class="iconfont icon-zan" :class="{'isLike':article_detail.isLike}"></text>
					 <text class="num">{{article_detail.zanNum}}</text>
				 </text>
				 <text @tap="collect">
					 <text class="iconfont icon-collect" :class="{'isCollect': article_detail.isCollect}"></text>
					 <text class="num">{{article_detail.collectionNum}}</text>
				 </text>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>

</template>

<script>
	import {getArticleDetail, addReadNum, addBrowsingHistory, likeArticle, addCollection, cancelCollection} from "../../api/article.js"
	import {getComments, addComment, toggleThumbUp} from "@/api/comments.js"
	import {toggle_focus_person} from "@/api/focus.js"
	import {isLogin, getTime} from "@/utils/index.js"
	
	export default {
		onLoad: function(option) {
			uni.showLoading({
				title: "加载中",
				mask: true
			})
			let arr = [];
			arr.push(
				getArticleDetail({
					id: option.articleId,
					userId: this.userId || -1
				})
			);
			arr.push(
				addReadNum({
					id: this.userId?option.articleId:-1
				})
			);
			arr.push(
				getComments({
					article_id: option.articleId,
					user_id: this.userId || -1
				})
			);
			if(this.userId) {
				arr.push(
					addBrowsingHistory({
						articleId: option.articleId,
						userId: this.userId
					})
				);
			}
			Promise.all(arr).then(res=> {
				this.article_detail = res[0].data[0];
				this.article_detail.article_content = this.article_detail.article_content.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
				this.article_detail.article_reading = +this.article_detail.article_reading;
				this.article_detail.article_reading++;
				uni.hideLoading();
				this.comments_arr = res[2].data.data;
				this.comments_arr.forEach(item=> {
					item.comment_time = getTime(item.comment_time)
					item.children.forEach(item=> {
						item.comment_time = getTime(item.comment_time)
					})
				})
			})
		},
		computed: {
			userId() {
				return uni.getStorageSync("userId")
			},
			avatar() {
				return uni.getStorageSync("avatarUrl")
			},
			realName() {
				return uni.getStorageSync("userName")
			}
		},
		data() {
			return {
				article_detail: {},
				pop_show: false,
				comment_value: "",
				comments_arr: [],
				placeholder: "",
				receive_id: "",
				receive_person_id: "",
				reply_comment_id: "",
				reply_index: 0,
				canPublish: true
			}
		},
		methods: {
			focus_person() {
				if(!isLogin()) return;
				let that = this;
				if(this.article_detail.isFocus) {
					uni.showModal({
						content: "是否取消关注？",
						success(res) {
							if(res.confirm) {
								toggle_focus_person({
									type: "cancel",
									user_id: that.userId,
									person_id: that.article_detail.user_id
								}).then(res=> {
									uni.showToast({
									    title: '取消关注成功',
									    duration: 2000,
										icon: "success"
									});
									that.article_detail.isFocus = !that.article_detail.isFocus;
								})
							}
						}
						
					})
				}else {
					toggle_focus_person({
						type: "focus",
						user_id: this.userId,
						person_id: this.article_detail.user_id
					}).then(res=> {
						uni.showToast({
						    title: '关注成功',
						    duration: 2000,
							icon: "success"
						});
						this.article_detail.isFocus = !this.article_detail.isFocus;
					})
				}
			},
			zan() {
				if(!isLogin()) return;
				if(this.article_detail.isLike) {
					likeArticle({
						type: 'cancel',
						article_id: this.article_detail.article_id,
						id: this.userId
					}).then(res=> {
						this.article_detail.isLike = false;
						this.article_detail.zanNum--;
					})
				}else {
					likeArticle({
						type: 'add',
						article_id: this.article_detail.article_id,
						id: this.userId
					}).then(res=> {
						this.article_detail.isLike = true;
						this.article_detail.zanNum++;
					})
				}
			},
			collect() {
				if(!isLogin()) return;
				if(this.article_detail.isCollect) {
					cancelCollection({
						articleId: this.article_detail.article_id,
						userId: this.userId
					}).then(res=> {
						this.article_detail.isCollect = false;
						this.article_detail.collectionNum--;
					})
				}else {
					addCollection({
						articleId: this.article_detail.article_id,
						userId: this.userId
					}).then(res=> {
						this.article_detail.isCollect = true;
						this.article_detail.collectionNum++;
					})
				}
			},
			add_comment() {
				if(!this.canPublish) return;
				this.canPublish = false;
				if(this.receive_id === "") {
					addComment({
						article_id: this.article_detail.article_id,
						comment_content: this.comment_value,
						user_id: this.userId
					}).then(res=> {
						this.canPublish = true;
						this.comments_arr.unshift({
							comments_id: res.data.insertId,
							comment_content: this.comment_value,
							thumbUpNum: 0,
							sender: {
							  avatar: this.avatar,
							  realName: this.realName,
							  id: this.userId,
							},
							comment_time: "刚刚",
							user_id: this.userId,
							children: []
						  });
						  this.pop_show = false;
						this.$refs.uToast.show({
							title: '发布评论成功',
							type: 'success',
						})
					})
				}else {
					addComment({
						user_id: this.userId,
						article_id: this.article_detail.article_id,
						comment_content: this.comment_value,
						receive_person_id: this.receive_person_id,
						receive_id: this.receive_id
					}).then(res=> {
						this.canPublish = true;
						this.comments_arr[this.reply_index].children.unshift({
							comment_content: this.comment_value,
							comment_time: "刚刚",
							comments_id: res.data.insertId,
							receive_person_id: this.receive_id,
							thumbUpNum: 0,
							sender: {
							  avatar: this.avatar,
							  realName: this.realName,
							  id: this.userId,
							},
							receiver: {
							  id: this.receive_id,
							  realName: this.placeholder.slice(1),
							}
						})
						this.$refs.uToast.show({
							title: '发布评论成功',
							type: 'success',
						})
						this.pop_show = false;
					})
				}
			},
			change_pop() {
				if(!isLogin()) return;
				this.placeholder = "";
				this.receive_id = "";
				this.pop_show = true;
				this.comment_value = "";
			},
			reply_comment(index) {
				if(!isLogin()) return;
				this.receive_id = this.comments_arr[index].comments_id;
				this.receive_person_id = this.comments_arr[index].user_id;
				this.pop_show = true;
				this.placeholder = "@"+this.comments_arr[index].sender.realName;
				this.reply_index = index;
				this.comment_value = "";
			},
			reply_comment_child(index, index_children) {
				if(!isLogin()) return;
				this.receive_id = this.comments_arr[index].comments_id;
				this.receive_person_id = this.comments_arr[index].children[index_children].sender.id;
				this.pop_show = true;
				this.placeholder = "@"+this.comments_arr[index].children[index_children].sender.realName;
				this.reply_index = index;
				this.comment_value = "";
			},
			thumpUp(index, index_child) {
				if(!isLogin()) return;
				if(index_child >= 0) {
					if(this.comments_arr[index].children[index_child].isThumbUp) {
						toggleThumbUp({
							"insert": false,
							"comment_id" : this.comments_arr[index].children[index_child].comments_id,
							"user_id": this.userId
						}).then(res => {
							this.comments_arr[index].children[index_child].thumbUpNum--;
							this.comments_arr[index].children[index_child].isThumbUp = false;
						})
					}else {
						toggleThumbUp({
							"insert": true,
							"comment_id" : this.comments_arr[index].children[index_child].comments_id,
							"user_id": this.userId
						}).then(res => {
							this.comments_arr[index].children[index_child].thumbUpNum++;
							this.comments_arr[index].children[index_child].isThumbUp = true;
						})
					}
				}else {
					if(this.comments_arr[index].isThumbUp) {
						toggleThumbUp({
							"insert": false,
							"comment_id" : this.comments_arr[index].comments_id,
							"user_id": this.userId
						}).then(res => {
							this.comments_arr[index].thumbUpNum--;
							this.comments_arr[index].isThumbUp = false;
						})
					}else {
						toggleThumbUp({
							"insert": true,
							"comment_id" : this.comments_arr[index].comments_id,
							"user_id": this.userId
						}).then(res => {
							this.comments_arr[index].thumbUpNum++;
							this.comments_arr[index].isThumbUp = true;
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-main {
		background: #f7f5f5;
		margin-bottom: 100rpx;
	}
	.article_detail {
		padding: 30rpx 15rpx;
		background-color: #fff;
		.article_title {
			font-size: 50rpx;
			font-weight: 600;
			color: #333;
		}
		.author {
			margin-top: 25rpx;
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
			.isFocus {
				background-color: #42c02e;
				color: #fff;
			}
		}
		.article-info {
			font-size: 23rpx;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			.article-time {
				
			}
			.middle-code {
				margin: 0 10rpx;
			}
		}
		
	}
	.pop-content {
		padding: 10rpx;
		.comment-input {
		}
		.comment-btn {
			text-align: right;
			button {
				display: inline-block;
				width: 150rpx;
				height: 70rpx;
				border: none;
				box-sizing: border-box;
				text-align: center;
				line-height: 60rpx;
				font-size: 30rpx;
			}
			button::after {
				border: none;
			}
			.cancel {
				color: #9a9898;
				margin-right: 20rpx;
				background: #fff;
				
			}
		}
	}
	.comments-area {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 10rpx 20rpx;
		.comment {
			padding: 20rpx 0;
			.sender {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.sender-left {
					.avatar {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						vertical-align: middle;
					}
					.real-name {
						margin-left: 20rpx;
						font-size: 28rpx;
						color: #333;
						font-weight: 600;
					}
				}
				.sender-right {
					color: #ddd;
					font-size: 24rpx;
					.icon-send-message {
						margin-right: 30rpx;
					}
					.isZan {
						color: #e33e33;
					}
				}
			}
			.comment-content {
				margin-left: 70rpx;
				font-size: 35rpx;
				.comment-data {
					color: #777;
					margin-left: 20rpx;
					font-size: 24rpx;
				}
			}
			.comments-children {
				margin-left: 70rpx;
				margin-top: 20rpx;
				.comment-child:not(:first-child) {
					margin-top: 10rpx;
				}
				.comment-child {
					.sender-child {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.avatar {
							width: 46rpx;
							height: 46rpx;
							border-radius: 50%;
							vertical-align: middle;
						}
						.real-name {
							margin-left: 20rpx;
							font-size: 24rpx;
							color: #333;
							font-weight: 600;
							margin-right: 10rpx;
						}
						.receive-name {
							margin-left: 10rpx;
							font-size: 24rpx;
							color: #333;
							font-weight: 600;
						}
						.sender-right-child {
							color: #ddd;
							font-size: 24rpx;
							.icon-send-message {
								margin-right: 30rpx;
							}
							.isZan {
								color: #e33e33;
							}
						}
					}
					.comment-content-child {
						margin-left: 70rpx;
						font-size: 35rpx;
						.comment-data-child {
							color: #777;
							margin-left: 20rpx;
							font-size: 24rpx;
						}
					}
				}
			}
		} 
	}
	.bottom-view {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		padding: 0 20rpx;
		background-color: #fff;
		border-top: 1px solid #ddd;
		line-height: 100rpx;
		.show-popup {
			display: inline-block;
			width: 350rpx;
			height: 60rpx;
			line-height: 60rpx;
			padding: 0 20rpx;
			background: #ddd;
			border-radius: 10rpx;
			font-size: 25rpx;
			color: #b3b0a3;
			// vertical-align: middle;
		}
		.operate-btn {
			color: #b7b7b7;
			display: inline-block;
			margin-left: 20rpx;
			// vertical-align: center;
			.zan-btn {
				margin-right: 20rpx;
				.icon-zan {
					color: #b7b7b7;
				}
				.isLike {
					color: #f54c0c;
				}
			}
			.num {
				color: #6b6767;
				margin-left: 10rpx;
			}
			.isCollect {
				color: #ffe73c;
			}
		}
	}
</style>
