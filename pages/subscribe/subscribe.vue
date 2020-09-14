<template>
	<view class="subscribe-content">
		<!-- <u-select v-model="show" mode="single-column" :list="list"></u-select>
		<picker @change="bindPickerChange" :value="index" :range="array" mode="selector">
		    <view class="uni-input">{{array[index]}}</view>
		</picker> -->
		<view class="btn-list">
			<button class="all-choose" :class="{'currentChose': choseIndex === 0}" @click="choseType(0)">全部</button>
			<button class="author-choose" :class="{'currentChose': choseIndex === 1}" @click="choseType(1)">仅看作者</button>
			<button class="zhuanlan-choose" :class="{'currentChose': choseIndex === 2}" @click="choseType(2)">仅看专栏</button>
		</view>
			<ul class="follow-list">
			  <li
			    v-for="(item,index) in currentList"
			    :key="index"
			    class="li-follow"
				@click="jump(item.focus_zhuanlan_time, index)"
			  >
				<view v-if="item.focus_zhuanlan_time">
				  <image :src="item.zhuanlan_img" class="avatar" />
				  <view class="follow-name">{{item.zhuanlan_name}}</view>
										<view class="follow-type isZhuanlan">专栏主页</view>
				</view>
				<view v-else>
				  <image
					:src="item.avatar"
					class="avatar"
				  />
				  <view class="follow-name">{{item.realName}}</view>
				  <view class="follow-type">作者主页</view>
			</view>
			  </li>
			</ul>
	</view>
</template>

<script>
	import {isLogin} from "@/utils/index.js"
	import {get_focus_list} from "@/api/focus.js"
	export default {
		onShow() {
			if(!isLogin()) return;
			this.userId = uni.getStorageSync("userId")
			get_focus_list({
				userId: this.userId
			}).then(res=> {
				this.followList = res.data.userList
				  .concat(res.data.zhuanlanList)
				  .sort((a, b) => {
					return (
					  new Date(a.focus_person_time || a.focus_zhuanlan_time).getTime() -
					  new Date(b.focus_person_time || b.focus_zhuanlan_time).getTime()
					);
				  });
				this.currentList = JSON.parse(JSON.stringify(this.followList));
				switch(this.choseIndex) {
					case 0:
						this.currentList = JSON.parse(JSON.stringify(this.followList));
						break;
					case 1:
						this.currentList = this.followList.filter(item => {
							return !item.zhuanlan_name;
						});
						break;
					case 2:
						this.currentList = this.followList.filter(item => {
							return item.zhuanlan_name;
						});
						break;
				}
			})
		},
		computed: {
			// userId() {
			// 	return uni.getStorageSync("userId");
			// }
		},
		data() {
			return {
				currentList: [],
				followList: [],
				choseIndex: 0,
				userId: ""
			}
		},
		methods: {
			choseType(index) {
				if(index === this.choseIndex) return;
				this.choseIndex = index;
				switch(index) {
					case 0:
						this.currentList = JSON.parse(JSON.stringify(this.followList));
						break;
					case 1:
						this.currentList = this.followList.filter(item => {
							return !item.zhuanlan_name;
						});
						break;
					case 2:
						this.currentList = this.followList.filter(item => {
							return item.zhuanlan_name;
						});
						break;
				}
			},
			jump(isZhuanlan, index) {
				let url = isZhuanlan?'/pages/zhuanlan_detail/zhuanlan_detail?zhuanlan_id='+this.currentList[index].focus_zhuanlan_id:'/pages/user/user?id='+this.currentList[index].focus_person_id;
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.subscribe-content {
		background: #f7f5f5;
		.btn-list {
			background-color: #fff;
			height: 100rpx;
			padding: 20rpx 0;
			button {
				display: inline-block;
				height: 60rpx;
				line-height: 60rpx;
				background: #efefef;
				color: #a9a9a9;
				font-size: 27rpx;
				border-radius: 30rpx;
				margin-left: 20rpx;
			}
			button::after {
				border: none;
			}
			.currentChose {
				background: #2d8cf0;
				color: #fff;
			}
		}
		    .follow-list {
		      margin-top: 20rpx;
			  background-color: #fff;
		      .li-follow {
		        height: 60px;
		        vertical-align: middle;
		        display: flex;
		        align-items: center;
		        padding: 10px;
		        cursor: pointer;
		        border-radius: 2px;
		        position: relative;
		      }
		      .avatar {
		        width: 40px;
		        height: 40px;
		        border-radius: 50%;
		        vertical-align: middle;
		      }
		      .follow-name {
		        display: inline-block;
		        margin-left: 20px;
		      }
		      .follow-type {
		        display: inline-block;
		        border: 1px solid #2d8cf0;
		        color: #2d8cf0;
		        padding: 3px 10px;
		        border-radius: 5px;
		        position: absolute;
		        right: 10px;
		        top: 17px;
		      }
		      .isZhuanlan {
		        border: 1px solid #1affb5;
		        color: #1affb5;
		      }
		    }
	}
</style>
