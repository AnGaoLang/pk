<template>
	<view class="container">
		<view class="login-bg-t bg">
			<image src='../../static/login-t.png' mode="widthFix"></image>
		</view>
		<view class="login-info">
			<view class="login-title">登录<text class="fw-bold">/注册</text></view>
			<view class="input-data">
				<view class="input-item d-flex">
					<image src="../../static/shoujihao.png" mode="widthFix"></image>
					<input type="text" v-model="mobile" placeholder="请输入您的手机号">
				</view>
				<view class="input-item d-flex input-password">
					<image src="../../static/mima.png" mode="widthFix"></image>
					<input type="password" v-model="password" placeholder="请输入您的密码">
				</view>
				<view class="input-item d-flex input-password">
					<image src="../../static/mima.png" mode="widthFix"></image>
					<input type="password" v-model="qr_password" placeholder="请输入您的密码">
				</view>
				<view class="input-item d-flex input-password">
					<image src="../../static/mima.png" mode="widthFix"></image>
					<input type="text" v-model="user_code" placeholder="请输入邀请码">
				</view>
			</view>
			<view class="login-btn" @click="reg">注册</view>
		</view>
		<view class="third-login">
			<view class="">第三方账号登录</view>
			<view class="wx">
				<image src="../../static/wx.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="login-bg-b bg">
			<image src="../../static/login-b.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	// import ""
	export default {
		data() {
			return {
				mobile:'',
				password:'',
				qr_password: '',
				user_code: '',
			};
		},
		methods:{
			reg(){
				let that= this;
				/* uni.switchTab({
						url:'/pages/index/index'
					})
					return */
				if (that.mobile == '') {
					that.$utils.showLayer('请填写手机号');
					return;
				}
				if (that.password == '') {
					that.$utils.showLayer('请填写密码');
					return;
				}
				let paramData = {
					mobile: that.mobile,
					password: that.password,
					qr_password: that.qr_password,
					user_code: that.user_code
				};
				this.$utils.postrequest('/api/signregister', paramData, function(res) {
					if (res.code == 200) {
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('avatar', res.data.avatar);
						uni.setStorageSync('name', res.data.name);
						uni.setStorageSync('userId', res.data.id);
						uni.setStorageSync('sex', res.data.sex);
						uni.setStorageSync('userInfo', JSON.stringify(res.data));
						uni.reLaunch({
							url: '/pages/index/index'
						});
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
		},
	}
</script>

<style lang="less">
@import "../../styles/login.less";

.login-btn {
	margin-top: 55rpx;
}
</style>
