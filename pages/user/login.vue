<template>
	<view class="container">
		<view class="login-bg-t bg">
			<image src='../../static/login-t.png' mode="widthFix"></image>
		</view>
		<view class="login-info">
			<view class="login-title" @click="toReg"><text class="fw-bold">登录/</text><text>注册</text></view>
			<view class="input-data">
				<view class="input-item d-flex">
					<image src="../../static/shoujihao.png" mode="widthFix"></image>
					<input type="text" maxlength="11" v-model="mobile" placeholder="请输入您的手机号">
				</view>
				<view class="input-item d-flex input-password">
					<image src="../../static/mima.png" mode="widthFix"></image>
					<input type="password" v-model="password" placeholder="请输入您的密码">
				</view>
			</view>
			<view class="forget" @click="toReg">忘记密码</view>
			<view class="login-btn" @click="login">登录</view>
		</view>
		<view class="third-login">
			<view class="">第三方账号登录</view>
			<view class="wx" @tap="wxLogin">
				<image src="../../static/wx.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="login-bg-b bg">
			<image src="../../static/login-b.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import {userLogin} from '../../api/api.js'
	export default {
		data() {
			return {
				mobile: "",
				password: "",
			};
		},
		
		onLoad() {
			let token = uni.getStorageSync("token");
			// console.log(token);
			if (token) {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		},
		
		methods: {
			wxLogin() {
				uni.login({
				  provider: 'weixin',
				  success: (loginRes) => {
				    console.log(loginRes.authResult);
				    let paramData = {
							access_token: loginRes.authResult.access_token,
				    	openid: loginRes.authResult.openid,
				    };
				    this.$utils.request('/api/login', paramData, (res) => {
							console.log(res)
				    	if (res.code == 200) {
				    		uni.setStorageSync('token', res.data.token);
				    		uni.setStorageSync('avatar', res.data.avatar);
				    		uni.setStorageSync('nickname', res.data.nickname);
				    		uni.setStorageSync('userId', res.data.id);
				    		uni.setStorageSync('sex', res.data.sex);
				    		uni.setStorageSync('userInfo', JSON.stringify(res.data));
								this.timLogin(res.data.id);
								if (this.$socketIo.disconnected) {
									this.$socketIo.connect();
								} else {
									this.$socketIo.emit('login', res.data.id);
								};
								
				    		uni.reLaunch({
				    			url: '/pages/index/index'
				    		});
				    	} else {
				    		this.$utils.showLayer(res.message);
				    	}
				    });
				  }
				});
			},
			login(){
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
					password: that.password
				};
				this.$utils.postrequest('/api/signlogin', paramData, (res) => {
					if (res.code == 200) {
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('avatar', res.data.avatar);
						uni.setStorageSync('nickname', res.data.nickname);
						uni.setStorageSync('userId', res.data.id);
						uni.setStorageSync('sex', res.data.sex);
						uni.setStorageSync('userInfo', JSON.stringify(res.data));
						this.timLogin(res.data.id);
						if (this.$socketIo.disconnected) {
							this.$socketIo.connect();
						} else {
							this.$socketIo.emit('login', res.data.id);
						};
						uni.reLaunch({
							url: '/pages/index/index'
						});
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
			timLogin(userId) {
				console.log(userId)
				userId = userId.toString();
				let promise = this.tim.login({
					userID: userId,
					userSig: this.genTestUserSig(userId.toString()).userSig
				});
				promise
					.then(resData => {
						//登录成功后 更新登录状态
						this.$store.commit('toggleIsLogin', true);
						//自己平台的用户基础信息
						//tim 返回的用户信息
						uni.setStorageSync('userTIMInfo', JSON.stringify(resData.data));
						console.log("登录成功！！！！");
					})
					.catch(err => {
						console.warn('login error:', err); // 登录失败的相关信息
					});
			},
			toReg() {
				uni.navigateTo({
					url: './reg'
				})
			},
		}
	}
</script>

<style lang="less">
@import "../../styles/login.less";
</style>
