<template>
	<view class="content">
		<view class="zhuanlan-detail-header">
			<view class="zhuanlan-information">
				<view class="zhuanlan-information-header">
					<image :src="zhuanlanDetail.zhuanlan.zhuanlan_img" class="avatar"></image>
					<view class="title">
						<view class="zhuanlan-name">{{zhuanlanDetail.zhuanlan.zhuanlan_name || ""}}</view>
						<view class="zhuanlan-article-num">{{zhuanlanDetail.article_num || 0}}篇文章</view>
					</view>
				</view>
				
				<view class="zhuanlan-abstract">
					<view>{{zhuanlanDetail.zhuanlan.zhuanlan_abstract || ""}}</view>
				</view>
				<view class="zhuanlan-btn">
					<view @click="focus_zhuanlan" class="zhuanlan-focus" :class="{'isFocus': zhuanlanDetail.isFocus || 0}">
						<text v-if="zhuanlanDetail.isFocus"><text class="iconfont icon-yes"></text>已关注</text>
						<text v-else><text class="iconfont icon-add"></text>关注</text>
						<text class="split">|</text>{{zhuanlanDetail.focus_num || 0}}
					</view>
					<view class="zhuanlan-publish" @click="showPopup">投稿</view>
				</view>
			</view>
		</view>
		<view style="width: 90%;">
			<article-list :articleList="articleList"></article-list>
		</view>
		<view class="popup" v-show="showModal">
			<view class="mask">
			</view>
			<view class="popup-content" :style="{'top':isLook?'150rpx':'50%','transform': isLook?'translate(-50%,0)':'translate(-50%,-50%)'}">
				<view class="content-header">
					<text class="header-title" >投稿文章</text>
				</view>
				<view class="contribution-content">
					<input v-if="!isChosen" type="text" v-model="searchWord" class="search-article" placeholder="搜索" @input="searchDebounce" @focus="isLook=true" @blur="isLook= false"/>
					<p v-else class="hasChosen clearfix"><text class="chose-title">{{chosenArticle.article_title}}</text><text class="iconfont icon-cancel cancelChosen" @click="isChosen=false"></text></p>
					<view class="contribution-list-wrapper" v-show="isLook">
						<view class="contribution-list">
						  <view v-for="(item, index) in contributionList" :key="index" class="contribution-item" @click="selectArticle(index)">
							{{item.article_title}}
						  </view>
						</view>
					</view>
					
				</view>
				<view class="content-btn">
					<view class="cancel" @click="cancelSumbit">取消</view>
					<view class="confirm" @click="submitArticle">确定</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {getZhuanlanDetail, focus, addArticle} from "../../api/zhuanlan.js"
	import articleList from "@/components/articleList.vue"
	import {getArticle, getSubmitArticle, getArticleById} from "../../api/article.js"
	import {isLogin, debounce} from "@/utils/index.js"
	export default {
		onLoad(option) {
			getZhuanlanDetail({
				"id": option.zhuanlan_id,
				"user_id": this.userId || -1
			}).then(res => {
				this.zhuanlanDetail = res.data
			}),
			getArticle({
				"page": this.page,
				"zhuanlan_id": option.zhuanlan_id,
				"id": this.userId || -1
			}).then(res => {
				this.articleList = res.data.data;
			})
			
		},
		onReachBottom() {
			if(this.loading === false) return;
			getArticle({
				"page": ++this.page,
				"zhuanlan_id": this.zhuanlanDetail.zhuanlan.zhuanlan_id,
				"id": this.userId || -1
			}).then(res => {
				this.articleList.push(...res.data.data);
				res.data.length != 10?this.loading = false:"";
			})
		},
		components: {
			articleList,
		},
		data() {
			return {
				articleList: [],
				zhuanlanDetail: [],
				isFocus: true,
				contributionList: [],
				isChosen: false,
				chosenArticle: {
					article_title: "这是一个标题",
					article_id: ""
				},
				isLook: false,
				searchWord: "",
				showModal: false,
				page: 1,
				loading: true
			};
		},
		computed: {
			userId() {
				return uni.getStorageSync("userId")
			}
		},
		mounted() {
			// if (this.zhuanlanDetail.isFocus) {
			// 	this.isFocus = true
			// } else {
			// 	this.isFocus = false
			// }
		},
		methods: {
			focus_zhuanlan() {
				if(!isLogin()) return;
				focus({
					type: this.zhuanlanDetail.isFocus?"cancel":"add",
					zhuanlan_id: this.zhuanlanDetail.zhuanlan.zhuanlan_id,
					user_id: this.userId
				}).then(res=> {
					this.zhuanlanDetail.isFocus = !this.zhuanlanDetail.isFocus;
					this.zhuanlanDetail.isFocus?this.zhuanlanDetail.focus_num++:this.zhuanlanDetail.focus_num--;
				})
			},
			showPopup() {
				if(!isLogin()) return;
				this.showModal = true;
				getSubmitArticle({
					user_id: this.userId,
					zhuanlan_id: this.zhuanlanDetail.zhuanlan.zhuanlan_id
				}).then(res => {
					this.contributionList = res.data.data
				})
			},
			selectArticle(index) {
				this.chosenArticle = this.contributionList[index];
				this.isChosen = true;
				this.isLook = false;
			},
			searchDebounce: debounce(function() {
			      getSubmitArticle({
			        user_id: this.userId,
			        zhuanlan_id: this.zhuanlanDetail.zhuanlan.zhuanlan_id,
			        search_word: this.searchWord
			      }).then(res => {
			        this.contributionList = res.data.data;
			      })
			    }, 500),
			cancelSumbit() {
			  this.isChosen = false;
			  this.searchWord = "";
			  this.showModal = false;
			},
			submitArticle() {
			      if(!this.isChosen) return;
			      addArticle({
			        zhuanlan_id: this.zhuanlanDetail.zhuanlan.zhuanlan_id,
			        article_id: this.chosenArticle.article_id
			      }).then(res => {
			        this.isChosen = false;
			        this.searchWord = "";
					this.showModal = false;
					this.$refs.uToast.show({
						title: '投稿成功',
						type: 'success',
					})
			        getArticleById({
						articleId: this.chosenArticle.article_id
					}).then(res=> {
						this.articleList.unshift(...res.data.data)
					})
			      })
			    },
		}

	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		.zhuanlan-detail-header {
			width: 100%;
			border-bottom: 1px solid #ddd;
			
			.zhuanlan-information {
				padding: 30rpx 30rpx 50rpx;
				.zhuanlan-information-header {
					
					.avatar {
						width: 152rpx;
						height: 152rpx;
						border-radius: 25rpx;
						vertical-align: middle;
					}
					.title {
						display: inline-block;
						vertical-align: middle;
						margin-left: 50rpx;
						.zhuanlan-name {
							font-size: 44rpx;
							color: #333;
						}
						.zhuanlan-article-num {
							margin-top: 7rpx;
							font-size: 30rpx;
						}
					}
				}
				.zhuanlan-abstract {
					margin: 30rpx 0;
					font-size: 34rpx;
					
				}
				.zhuanlan-btn {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.zhuanlan-focus {
						background-color: #4CD964;
						color: #fff;
						width: 48%;
						text-align: center;
						height: 70rpx;
						line-height: 70rpx;
						border-radius: 35rpx;
						.iconfont {
							margin-right: 10rpx;
						}
						.split {
							margin: 0 10rpx;
						}
					}
					.isFocus {
						border: 1rpx solid #ddd;
						color: #8a8a8a;
						background-color: #fff;
					}
					.zhuanlan-publish {
						border: 1rpx solid #4CD964;
						color: #4CD964;
						width: 48%;
						text-align: center;
						height: 70rpx;
						line-height: 70rpx;
						border-radius: 35rpx;
					}
				}
			}
		}
		.popup {
			position: fixed;
			left: 0;
			top: 0;
			z-index: 1000;
			.mask {
				width: 100vw;
				height: 100vh;
				background-color: rgba(0, 0, 0, .4);
			}
			.popup-content {
				width: 95%;
				position: absolute;
				left: 50%;
				// top: 50rpx;
				// transform: translate(-50%, -50%);
				border-radius: 20rpx;
				background: #fff;
				transition: top .3s;
				.content-header {
					text-align: center;
					border-bottom: 1px solid #ddd;
					padding: 28rpx 0;
					.header-title {
						font-size: 40rpx;
						font-weight: 600;
					}
				}
				.contribution-content {
					// width: 90%;
					padding: 40rpx;
					margin: 0 auto;
					position: relative;
					.search-article {
						border: 1px solid #ddd;
						padding: 12rpx 14rpx;
						height:76rpx;;
						box-sizing: border-box;
						background-color: #fff;
						border-radius: 10rpx;
					}
					.hasChosen {
						height:76rpx;
						box-sizing: border-box;
						border: 1px solid #ddd;
						background-color: #f6f6f6;
						padding: 12rpx 14rpx;
						line-height: 52rpx;
						color: #1a1a1a;
						border-radius: 6rpx;
						.cancelChosen {
						  float: right;
						}
						.chose-title {
							width: 90%;
							display: inline-block;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					  }
					.contribution-list-wrapper {
						padding: 0 40rpx;
						position: relative;
						.contribution-list {
						// padding: 0 40rpx;
						  position: absolute;
						  left: 0rpx ;
						  top: 10rpx;
						  background: #fff;
						  width: 100%;
						  box-shadow:0px 0px 10rpx rgba(0, 0, 0, .2);
						  border-radius: 12rpx;
						  .contribution-item {
							padding: 20rpx;
							
						  }
						  .contribution-item:not(:last-child) {
							  border-bottom: 1px solid #ddd;
						  }
						}
					}
					
				}
				.content-btn {
					text-align: right;
					padding: 40rpx;
					border-top: 1px solid #ddd;
					view {
						display: inline-block;
						padding: 15rpx 30rpx;
						color: #515a6e;
						border-radius: 8rpx;
					}
					.cancel {
						background-color: transparent;
					}
					.confirm {
						background-color: #2d8cf0;
						border: 1px solid #2d8cf0;
						color: #fff;
						margin-left: 16rpx;
					}
				}
			}
		}
	}
</style>
