<template>
	<view class="content">
		<view class="zhuanlan-list" v-for="(item,index) in zhuanlanlist" :key="index" :style="{backgroundImage: 'url(' + (item.zhuanlan_bg || item.zhuanlan_img) + ')'}">
			<navigator :url="'/pages/zhuanlan_detail/zhuanlan_detail?zhuanlan_id='+ item.zhuanlan_id" open-type="navigate" hover-class="none"
			 style="height: 100%;">
				<view class="mask"></view>
				<view class="item">
					<view class="title">
						<text>{{item.zhuanlan_name}}</text>
					</view>
					<view class="footer">
						<u-icon name="list" color="#2979ff"></u-icon>
						<text>文章数:{{item.article_num}}篇</text>
						<u-icon name="man-add" color="#2979ff" style="margin-left: 2vw;"></u-icon>
						<text>关注人数:{{item.focus_num}}人</text>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import {
		getZhuanlan
	} from "../../api/zhuanlan.js"
	import {
		isLogin
	} from "@/utils/index.js"
	export default {
		onLoad() {
			getZhuanlan({
				"user_id": this.userId || -1
			}).then(res => {
				this.zhuanlanlist = res.data
			})
		},
		onReachBottom() {
			// if(this.loading === false) return;
			getZhuanlan({
				"user_id": this.userId || -1
			}).then(res => {
				this.zhuanlanlist.push(...res.data)
				this.removeRepeat();
				
			})
		},
		onPullDownRefresh() {
			getZhuanlan({
				"user_id": this.userId || -1
			}).then(res => {
				this.zhuanlanlist = res.data;
				uni.stopPullDownRefresh()
			})
		},
		data() {
			return {
				zhuanlanlist: [],
			};
		},
		methods: {
			removeRepeat() {
				let obj = {};
				this.zhuanlanlist = this.zhuanlanlist.reduce((cur,next) => {
				    obj[next.zhuanlan_id] ? "" : obj[next.zhuanlan_id] = true && cur.push(next);
				    return cur;
				},[])
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-direction: column;
		padding-bottom: 2.5vh;

		.zhuanlan-list {
			margin-top: 2.5vh;
			width: 90%;
			height: 20vh;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center center;
			border-radius: 1.5vh;
			color: #FFFFFF;
			position: relative;

			.mask {
				position: absolute;
				border-radius: 1.5vh;
				height: 100%;
				width: 100%;
				background: rgba(0, 0, 0, 0.4);
				z-index: 0;
			}

			.item {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.title {
					margin-left: 2.5%;
					font-size: 48rpx;
					z-index: 1;

				}

				.footer {
					margin-left: 2.5%;
					margin-top: 2.5%;
					font-size: 24rpx;
					z-index: 1;

					text {
						margin-left: 1vw;
					}
				}
			}
		}

		.zhuanlan-list:active {
			transform: scale(0.9);
			transition-duration: 0.3s;
		}
	}
</style>
