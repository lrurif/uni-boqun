<template>
	<view class="content">
		<u-search class="search-tool" shape="square" margin="30rpx 20rpx" placeholder="搜索文章" :disabled="true" v-model="keyword" @click="search"></u-search>
		<view style="width: 100%;">
			<article-list :articleList="articleList"></article-list>
		</view>
		
		<button @click="write" class="article-btn-add add-article" :style="{'bottom': writeShow}">
			<u-icon name="plus"></u-icon>
			写文章
		</button>
		<view v-show="!loading" style="height: 100rpx;line-height: 100rpx;">加载完了哦</view>
	</view>
</template>

<script>
	import {getArticle} from "../../api/article.js"
	import articleList from "@/components/articleList.vue"
	import {isLogin} from "@/utils/index.js"
	export default {
		onLoad() {
			getArticle({
				"page": this.page,
				"id": this.userId || -1
			}).then(res=> {
				this.articleList = res.data.data;
			})
		},
		onPullDownRefresh() {
			this.page = 1;
			this.loading = true;
			getArticle({
				"page": this.page,
				"id": this.userId || -1
			}).then(res=> {
				this.articleList = res.data.data;
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if(this.loading === false) return;
			getArticle({
				"page": ++this.page,
				"id": this.userId || -1
			}).then(res=> {
				let hash = {};
				this.articleList.push(...res.data.data);
				this.removeRepeat();
				if(res.data.data.length != 10) {
					this.loading = false;
				}
			// 	this.articleList = this.articleList.reduceRight((item, next) => {
			// 		hash[next.article_id] ? '' : hash[next.article_id] = true && item.push(next);
			// 	return item
			// }, []);
			})
		},
		computed: {
			
			userId() {
				return uni.getStorageSync("userId")
			}
		},
		onPageScroll(e) {
			if(this.lastPosition > e.scrollTop) {
				this.$nextTick(function(){
					this.writeShow = "100rpx";
				})
			}
			this.writeShow = "-200rpx";
			this.lastPosition = e.scrollTop
		},
		onShow() {
		},
		onHide() {
		},
		components: {
			articleList,
		},
		data() {
			return {
				articleList: [],
				title: 'Hello',
				keyword: "",
				lastPosition: 0,
				writeShow: "100rpx",
				page: 1,
				loading: true
			}
		},
		methods: {
			write(e) {
				let loginStatus = isLogin();
				if(loginStatus) {
					uni.navigateTo({
						url: "/pages/add_article/add"
					})
				}
			},
			removeRepeat() {
				let obj = {};
				this.articleList = this.articleList.reduce((cur,next) => {
				    obj[next.article_id] ? "" : obj[next.article_id] = true && cur.push(next);
				    return cur;
				},[])
			},
			search() {
				uni.navigateTo({
					url: "/pages/search/search"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-family: '微软雅黑';
		.search-tool {
			width: 100%;
		}
		.add-article {
			position: fixed;
			bottom: 100rpx;
			left: 50%;
			transform: translate(-50%,0);
			transition: bottom .5s;
		}
		.article-btn-add {
			background: #2979ff;
			border-color: #2979ff;
			color: #fff;
			font-size: 28rpx;
		}
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
