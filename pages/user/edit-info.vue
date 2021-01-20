<template>
	<view class="page-top">
		<view class="container">
			<view class="user-info-item h1 d-flex-jsb">
				<view class="item-l">头像</view>
				<view class="item-r d-flex">
					<view class="user-face" @click="changeAvatar">
						<image :src="userInfo.avatar" mode="widthFix"></image>
					</view>
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="user-info-item h2 d-flex-jsb">
				<view class="item-l">昵称</view>
				<view class="item-r d-flex">
					<input type="text" v-model="userInfo.name">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="user-info-item h2 d-flex-jsb">
				<view class="item-l">手机号</view>
				<view class="item-r d-flex">
					<input type="text" placeholder="请填写手机号" v-model="userInfo.mobile">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="user-info-item h2 d-flex-jsb">
				<view class="item-l">修改密码</view>
				<view class="item-r d-flex">
					<input type="password" placeholder="请设置密码" v-model="password">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="user-info-item h2 d-flex-jsb">
				<view class="item-l">真实姓名</view>
				<view class="item-r d-flex">
					<input type="text" placeholder="提现支付宝需要真实姓名" v-model="userInfo.alipay_name">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="user-info-item h2 d-flex-jsb">
				<view class="item-l">支付宝账号</view>
				<view class="item-r d-flex">
					<input type="text" placeholder="提现到支付宝的账号" v-model="userInfo.alipay_account">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			
			<view class="pk" @click="sureEdit">点击确认</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
				password:'******'
			};
		},
		
		onLoad() {
			this.getUser();
		},
		
		methods: {
			// 上传头像图片
			changeAvatar(){
				var that = this
				uni.chooseImage({ //选中本地图片
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: res => {
						uni.showLoading({ //加载框
							title: '加载中...'
						})
						// console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						console.log(tempFilePaths[0]);
							uni.uploadFile({
								url: that.$url.url_config+'api/upload', //上传接口地址
								filePath: tempFilePaths[0],
								name: 'file',
								header:{
									"Authorization": 'Bearer ' + wx.getStorageSync('token')
								},
								success: (res) => {
									let data = JSON.parse(res.data);
									console.log(data);
									uni.hideLoading();
									if(data.code==200){
										that.userInfo.avatar = data.data;
									}else{
										uni.showToast({
											title: res.message,
											icon:'none',
											duration: 2000
										});
									}
								},
								fail(err) {
									uni.hideLoading();
									console.log(err);
									uni.showToast({
										title: '上传失败',
										icon:'none',
										duration: 2000
									});
								}
							});
					}
				});
			},
			// 修改用户信息
			sureEdit(){
				let obj = {
					avatar:this.userInfo.avatar,
					name:this.userInfo.name,
					mobile:this.userInfo.mobile,
					alipay_name: this.userInfo.alipay_name,
					alipay_account: this.userInfo.alipay_account,
				}
				if(this.password!='******'){
					obj.password = this.password
				}
				this.$utils.postrequest("/api/my/useredit", obj , res => {
					if (res.code === 200) {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				})
			},
			// 获取展示用户信息
			getUser() {
				this.$utils.request("/api/my/useredit", {}, res => {
					if (res.code === 200) {
						this.userInfo = res.data;
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.container {
		padding: 0 30rpx;

		.user-info-item {
			font-size: 32rpx;
			.user-face {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				overflow: hidden;
				background-color: #eee;
				
				image {
					width: 100%;
				}
			}

			&.h1 {
				padding: 25rpx 0;
			}
			
			&.h2 {
				height: 98rpx;
				line-height: 98rpx;
				input {
					height: 98rpx;
				}
			}

			border-bottom: 1px solid #F5F5F5;

			input {
				text-align: right;
				font-size: 32rpx;
			}

			.item-r>image {
				width: 14rpx;
				margin-left: 34rpx;
			}
		}
	}
	
	.pk {
		position: absolute;
		bottom: 70rpx;
		width: calc(100% - 60rpx);
		box-sizing: border-box;
	}
</style>
