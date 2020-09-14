<template>
	<view class="history-list">
		<view class="history-item" v-for="(item, index) in historyList" :key="index" @click="">
			<view class="history-title">{{item.article_title}}</view>
			<view class="history-time">{{item.browsing_time}}</view>
		</view>
		<view v-show="!loading" style="height: 100rpx;line-height: 100rpx;text-align: center;"><text :decode="true">-&nbsp;</text><text class="iconfont icon-bottom-emoil"></text>我是有底线的&nbsp;-</view>
	</view>
</template>

<script>
	import {getBrowsingArticle} from "@/api/article.js"
	import {getTime} from "@/utils/index.js"
	export default {
		onLoad() {
			getBrowsingArticle({
				"page": this.page,
				"userId": this.userId
			}).then(res=> {
				this.historyList = res.data.data;
				this.historyList.forEach(item => {
					item.browsing_time = getTime(item.browsing_time)
				})
			})
		},
		onReachBottom() {
			if(this.loading === false) return;
			getBrowsingArticle({
				"page": ++this.page,
				"userId": this.userId
			}).then(res=> {
				res.data.data.forEach(item => {
					item.browsing_time = getTime(item.browsing_time)
				})
				this.historyList.push(...res.data.data);
				if(res.data.data.length != 10) {
					this.loading = false;
				}
				})
		},
		computed: {
			userId() {
				return uni.getStorageSync("userId")
			}
		},
		data() {
			return {
				page: 1,
				historyList: [],
				loading: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.history-list {
		.history-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 45rpx 20rpx;
			border-bottom: 1px solid #ddd;
			.history-title {
				font-size: 32rpx;
				color: #333;
				width: 500rpx;
			}
			.history-time {
				font-size: 26rpx;
				color: #a5a0a0;
			}
		}
	}
</style>
