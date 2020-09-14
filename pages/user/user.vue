<template>
	<view class="content">
		<view class="mask"></view>
		<view class="user_info">
			<view class="avatar">
				<u-avatar :src="InfoList.avatar" size="large"></u-avatar>
				<view class="" style="font-size: 48rpx;margin-left: 5vw;">
					{{InfoList.userName}}
				</view>
			</view>
			<view class="introduction" style="font-size: 24rpx;">
				{{InfoList.introduction}}
			</view>
			<view class="user_status">
				<view class="user_data">
					<view class="kpi">
						{{InfoList.focusNum}}
						<p>关注</p>
					</view>
					<view class="kpi">
						{{InfoList.fansNum}}
						<p>粉丝</p>
					</view>
					<view class="kpi">
						{{InfoList.articleNum}}
						<p>文章数</p>
					</view>
				</view>
				<text v-if="userId!=id" @click="focus_person" class="focus-author" :class="{'isFocus': InfoList.isFocus}">{{InfoList.isFocus?"已关注":"关注"}}</text>
			</view>
		</view>

		<view class="article">
			<view style="width: 95%;">
				<u-tabs name="cate_name" :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
				<!-- <view v-if="userId!=id" class="article-tab">
					<text style="">文章</text>
				</view> -->
			</view>
			<view style="width: 100%;">
				<u-line color="#ddd" />
			</view>
			<view class="my-article" style="width: 100%;" v-show="current==0">
				<article-list :author_show="false" :articleList="articleList"></article-list>
			</view>
			<view class="collect-article" style="width: 100%;" v-show="current==1">
				<article-list :articleList="collectList"></article-list>
			</view>


		</view>
		<!-- {{InfoList.userName}}=={{userId}}=={{id}} -->
	</view>
</template>

<script>
	import {
		getUserInfoById
	} from "../../api/user.js"
	import articleList from "@/components/articleList.vue"
	import {
		getArticle
	} from "../../api/article.js"
	import {
		getCollectArticle
	} from "../../api/collect.js"
	import {
		isLogin
	} from "@/utils/index.js"
	import {
		toggle_focus_person
	} from "@/api/focus.js"
	export default {
		onLoad(option) {
			this.id = option.id
			if (option.index) {
				this.current = option.index
			}
			getUserInfoById({
					"userId": option.id,
					"id": this.userId || -1
				}).then(res => {
					this.InfoList = res.data;
					if (this.InfoList.introduction == null || this.InfoList.introduction === "null") {
						this.InfoList.introduction = "该用户还没有简介"
					}
				}),
				getArticle({
					"page": 1,
					"author_id": option.id,
					"id": this.userId || -1
				}).then(res => {
					this.articleList = res.data.data;
				})
			if (option.id == this.userId) {
				getCollectArticle({
					"page": 1,
					"userId": option.id,
				}).then(res => {
					console.log(res.data.data)
					this.collectList = res.data.data;
				})
			}
			uni.getSystemInfo({
			    success: res=> {
					// this.screenHeight = res.screenHeight
					// this.windowWidth = res.windowWidth
			        console.log(res.screenHeight);
			        console.log(res.windowHeight);
			    }
			});

		},
		components: {
			articleList,
		},
		data() {
			return {
				id: null,
				InfoList: [],
				isFocus: true,
				articleList: [],
				collectList: [],
				list: [{
					cate_name: '文章'
				}, {
					cate_name: '收藏'
				}, ],
				current: 0,
				windowHeight:603
			};
		},
		computed: {
			userId() {
				return uni.getStorageSync("userId")
			}
		},
		mounted() {
			console.log(typeof this.InfoList.introduction)
			if (this.userId != this.id) {
				this.list = [{
					cate_name: '文章'
				}, ]
			}
		},
		methods: {
			change(index) {
				this.current = index;
			},
			focus_person() {
				console.log('123')
				if (!isLogin()) return;
				let that = this;
				if (this.InfoList.isFocus) {
					uni.showModal({
						content: "是否取消关注？",
						success(res) {
							if (res.confirm) {
								toggle_focus_person({
									type: "cancel",
									user_id: that.userId,
									person_id: that.id
								}).then(res => {
									uni.showToast({
										title: '取消关注成功',
										duration: 2000,
										icon: "success"
									});
									that.InfoList.isFocus = !that.InfoList.isFocus;
								})
							}
						}

					})
				} else {
					toggle_focus_person({
						type: "focus",
						user_id: this.userId,
						person_id: this.id
					}).then(res => {
						uni.showToast({
							title: '关注成功',
							duration: 2000,
							icon: "success"
						});
						this.InfoList.isFocus = !this.InfoList.isFocus;
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: url("https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1295522779,4078280171&fm=26&gp=0.jpg") no-repeat;
		background-size: 100% 100%;
		position: relative;

		.mask {
			position: absolute;
			height: 100%;
			width: 100%;
			background: rgba(0, 0, 0, 0.4);
			z-index: 0;
		}

		.user_info {
			width: 90%;
			height: 320rpx;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-evenly;
			flex-direction: column;
			color: #FFFFFF;
			z-index: 1;

			.avatar {
				display: flex;
				align-items: center;
			}

			.user_status {
				width: 100%;
				display: flex;
				justify-content: space-between;

				.user_data {
					width: 30%;
					display: flex;
					justify-content: space-between;
					font-size: 24rpx;

					.kpi {
						text-align: center;
					}
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
		}

		.article {
			z-index: 1;
			width: 100%;
			height: 75%;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-top-right-radius: 1.5vh;
			border-top-left-radius: 1.5vh;
			background-color: #FFFFFF;

			.article-tab {
				height: 80rpx;
				font-size: 30rpx;
				display: flex;
				align-items: center;
				color: rgb(41, 121, 255);

				text {
					margin-left: 80rpx;
					height: 70rpx;
					line-height: 70rpx;
					display: inline-block;
					position: relative;
				}

				text::after {
					content: "";
					display: block;
					position: absolute;
					left: 50%;
					top: 90%;
					transform: translateX(-50%);

					width: 75%;
					height: 6rpx;
					background-color: rgb(41, 121, 255);
				}

			}

		}
	}
</style>
