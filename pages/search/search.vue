<template>
	<view class="search-content">
		<u-search class="search-tool" shape="square" margin="30rpx 20rpx" v-model="keyword" @search = "search" @focus="isSearch = true" @custom = "search"></u-search>
		<view class="search-history" v-show="isSearch">
			<view class="search-history-header">
				<text class="header-title">历史记录</text>
				<text class="iconfont icon-rubbish" @click="clearHistory"></text>
			</view>
			<view class="history-list">
				<view class="history-item" v-for="(item, index) in historyList" :key="index" @click="search(item)">
					{{item}}
				</view>
			</view>
		</view>
		<view v-show="!isSearch">
			<u-tabs name="cate_name" :show-bar="false" :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
			<view style="background-color: #fff;" v-show="current === 0">
			</view>
			<view v-show="current === 1" class="user-list">
				<view v-for="(item, index) in userList" :key="index" class="user-item">
						<image :src="item.avatar || '../../static/images/home.png'" class="avatar"></image>
						<view class="user-info">
							<view class="user-name">{{item.realName}}</view>
							<view class="user-num">
								<text>文章</text>
								<text>·</text>
								<text>{{item.articleNum}}</text>
								<text>粉丝</text>
								<text>·</text>
								<text>{{item.focusNum}}</text>
							</view>
						</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getArticle} from "@/api/article.js"
	import articleList from "@/components/articleList.vue"
	import {getUserBySearch} from "@/api/user.js"
	export default {
		onLoad() {
			if(!Array.isArray(uni.getStorageSync('history'))) uni.setStorageSync('history', []);
			this.historyList = uni.getStorageSync('history');
		},
		components: {
			articleList
		},
		data() {
			return {
				keyword: "",
				historyList: ["LOL","CSGO","CFHD","学习软件","家常菜","家常菜大全"],
				page: 1,
				isSearch: true,
				list: [{
					cate_name: '文章'
				}, {
					cate_name: '用户'
				}, ],
				current: 0,
				articleList: [],
				userList: []
			}
		},
		computed: {
			userId() {
				return uni.getStorageSync("userId")
			},
		},
		methods: {
			search(word) {
				if(this.keyword.trim() === "" && !word) return;
				if(word) this.keyword = word;
				getArticle({
					search_word: this.keyword,
					page: this.page,
					id: this.userId || -1
				}).then(res=> {
					this.addHistory(this.keyword);
					this.isSearch = false;
					this.articleList = res.data.data;
				})
				getUserBySearch({
					search_word: this.keyword,
				}).then(res=> {
					this.isSearch = false;
					this.userList = res.data
				})
			},
			change(index) {
				this.current = index;
			},
			addHistory(str) {
				this.historyList.includes(str)?this.historyList.splice(this.historyList.indexOf(str)):"";
				this.historyList.unshift(str)
				uni.setStorageSync('history', this.historyList)
			},
			clearHistory() {
				uni.setStorageSync('history', [])
				this.historyList = [];
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-content {
		.search-history {
			// padding: 10rpx 20rpx;
			.search-history-header {
				padding: 0 20rpx;
				.header-title {
					color: #333;
					font-size: 26rpx;
				}
				.icon-rubbish {
					float: right;
					font-size: 26rpx;
				}
			}
			.history-list {
				margin-top: 20rpx;
				.history-item {
					display: inline-block;
					font-size: 26rpx;
					border-radius: 25rpx;
					background-color: #efebeb;
					height: 50rpx;
					line-height: 50rpx;
					padding: 0 20rpx;
					margin-left: 20rpx;
					margin-top: 20rpx;
				}
			}
		}
		.user-list {
			.user-item {
				border-bottom: 1px solid #ddd;
				padding: 30rpx 20rpx;
				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					vertical-align: middle;
				}
				.user-info {
					display: inline-block;
					vertical-align: middle;
					margin-left: 20rpx;
					.user-name {
						font-size: 28rpx;
						color: #333;
					}
					.user-num {
						color: #8e8888;
						font-size: 22rpx;
						margin-top: 8rpx;
					}
				}
			}
		}
	}
</style>
