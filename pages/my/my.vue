<template>
	<view class="content">
		<view class="avatar" v-if="isShow">
			<u-avatar :src="avatarUrl" size="large"></u-avatar>
			<p class="user-name">{{name}}</p>
		</view>
		<view class="list" v-show="isShow">
			<u-cell-group>
				<navigator :url="'/pages/user/user?id='+ userId+'&index=0'" open-type="navigate" hover-class="none">
					<u-cell-item icon="list" title="我的文章"></u-cell-item>
				</navigator>
				<navigator :url="'/pages/user/user?id='+ userId+'&index=1'" open-type="navigate" hover-class="none">
					<u-cell-item icon="heart-fill" title="收藏的文章"></u-cell-item>
				</navigator>
				<navigator url="/pages/history/history"><u-cell-item icon="bookmark-fill" title="阅读记录"></u-cell-item></navigator>
				<u-cell-item icon="close" title="退出登录" @click="clearStorageSync"></u-cell-item>
			</u-cell-group>
		</view>
		<u-button @click="login" size="medium" :ripple="true" open-type="getUserInfo" withCredentials="true" type="success"
		 v-show="!isShow" class="login">
			<u-icon name="weixin-circle-fill" size="40" style=""></u-icon>微信一键登录
		</u-button>
	</view>
</template>

<script>
	import {wxLogin} from "../../api/user.js"
	export default {
		data() {
			return {
				name: " ",
				avatarUrl: "",
				isShow: false,
				userId: ""
			}
		},
		computed: {
			// userId() {
			// 	return uni.getStorageSync("userId")
			// }
		},
		methods: {
			test() {
				uni.switchTab({
					url: '/pages/test/test'
				});
			},
			// chooseAvatar() {
			// 	// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
			// 	this.$u.route({
			// 		// 关于此路径，请见下方"注意事项"
			// 		url: '/pages/index/u-avatar-cropper',
			// 		// 内部已设置以下默认参数值，可不传这些参数
			// 		params: {
			// 			// 输出图片宽度，高等于宽，单位px
			// 			destWidth: 300,
			// 			// 裁剪框宽度，高等于宽，单位px
			// 			rectWidth: 200,
			// 			// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
			// 			fileType: 'jpg',
			// 		}
			// 	})
			// },
			login() {
				var _this = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											_this.name = infoRes.userInfo.nickName
											_this.avatarUrl = infoRes.userInfo.avatarUrl
											_this.isShow = true
											wxLogin({
												"userName": loginRes.code,
												"realName": infoRes.userInfo.nickName,
												"avatar": infoRes.userInfo.avatarUrl
												}).then(res=> {
													uni.setStorage({
														key: 'userName',
														data: infoRes.userInfo.nickName,
														success: function() {
															console.log('用户名保存成功');
														}
													});
													uni.setStorage({
														key: 'avatarUrl',
														data: infoRes.userInfo.avatarUrl,
														success: function() {
															console.log('头像地址保存成功');
														}
													});
													uni.setStorageSync("userId", res.data.userId);
													_this.userId = res.data.userId;
												})
											
										}
									});
								}
							});
						}
					}
				})
			},
			clearStorageSync() {
				this.isShow = false
				uni.clearStorageSync();
				this.userId = "";
				console.log("缓存清除成功")
			}
		},
		onLoad() {
			
			var _this = this
			uni.checkSession({
				success() {
					console.log("存在缓存!");
					uni.getStorage({
						key: 'userName',
						success: function(res) {
							_this.name = res.data
						},
						fail: function() {
							_this.isShow = false
						}
					});
					uni.getStorage({
						key: 'avatarUrl',
						success: function(res) {
							_this.avatarUrl = res.data
						},
						fail: function() {
							_this.isShow = false
						}
					});
				},
				fail() {
					_this.isShow = false
				}
			})
		},
		created() {
			this.userId = uni.getStorageSync("userId");
			this.userId?this.isShow = true:"";
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		height: 100vh;
		position: relative;
		overflow-y: hidden;

		.avatar {
			width: 100vw;
			height: 24vh;
			margin-top: 10vh;
			display: flex;
			align-items: center;
			justify-content: space-around;
			flex-direction: column;

			.head_img {
				width: 15vh;
				height: 15vh;
				border-radius: 50%;
				background-color: #C0C0C0;
			}
			.user-name {
				font-weight: bold;
				font-size: 42rpx;
			}
		}

		.list {
			margin-top: 15vh;
			width: 100vw;
			height: 40vh;
		}

		.login {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
