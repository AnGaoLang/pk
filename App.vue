<script>
	export default {
		data() {
			return {
				timer: '',
			}
		},
		mounted() {
			let userInfo = uni.getStorageSync('userInfo');
			let uid = userInfo ? JSON.parse(uni.getStorageSync('userInfo')).id : '';
			if(uid){
				this.timLogin(uid); 
			}
			/**官网有很多关于关于sdk 其他的监听方法（比如：有新的消息，用户资料更新等等）
			 * 详情可对照： https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html
			 * 监听的含义：服务端发生了数据变更---前端全局可以接收到变更通知--前端就可以自动触发某个事件来更新相应数据
			 * */
			// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
			this.tim.on(this.$TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
			this.tim.on(this.$TIM.EVENT.SDK_NOT_READY, this.sdkOnRead, this);
			// 收到新消息
			this.tim.on(this.$TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
			// 会话列表更新
			this.tim.on(this.$TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
				this.$store.commit("updateConversationList", event.data);
			});
		},
		methods: {
			onReadyStateUpdate({name}) {
				const isSDKReady = name === this.$TIM.EVENT.SDK_READY ? true : false;
				//自动监听并更新 sdk 的ready 状态 （未登录是 notReady  登录后是ready）
				this.$store.commit("toggleIsSDKReady", isSDKReady);
				//sdk ready 后  肯定完成了登录操作    这里可以获取用户存储在im的基础信息/离线消息/黑名单列表
				console.log(name, this.$TIM.EVENT.SDK_READY)
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let profile = this.tim.updateMyProfile({
				  nick: userInfo.name,
				  avatar: userInfo.avatar,
				});
				profile.then(function(imResponse) {
				  console.log('资料', imResponse.data); // 更新资料成功
				}).catch(function(imError) {
				  console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
				});
				let loginState = this.$store.state.isLogin;
				// debugger
				console.log(!isSDKReady&&loginState)
				if(!isSDKReady&&loginState){
					let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
					this.timLogin(userInfo.id);
				};
				
			},
			sdkOnRead() {
				console.log('-------sdk----no');
				let loginState = this.$store.state.isLogin;
				let userInfo = uni.getStorageSync('userInfo');
				let uid = userInfo ? JSON.parse(uni.getStorageSync('userInfo')).id : '';
				if(loginState && uid){
					this.timLogin(uid); 
				}
			},
			onReceiveMessage({data: messageList}) {
				// this.handleAt(messageList);
				console.log('messageList', messageList)
				this.$store.commit("pushCurrentMessageList", messageList);
			},
			//根据消息列表请求聊天对象的用户信息 并完成数据拼接
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
		},
		onLaunch: function() {
			this.$socketIo.on('disconnect', (msg) => {
				if (uni.getStorageSync('userInfo')) {
					this.$socketIo.connect();
				};
			});
			this.$socketIo.on('connect', () => {
				let userInfo = uni.getStorageSync('userInfo');
				let uid = userInfo ? JSON.parse(uni.getStorageSync('userInfo')).id : '';
				console.log('app', uid)
			  uid && this.$socketIo.emit('login', uid)
			});
			this.$socketIo.on('new_msg', (msg) => {
				let message = msg && JSON.parse(msg);
				console.log(message)
				if (message && message.order_user) {
					if (!this.timer) {
						this.timer = setTimeout(() => {
							this.timer = null;
							uni.navigateTo({
								url: `/pages/nVue/index?dialog=${JSON.stringify(message.order_user)}`
							})
						}, 500)
					}
				}
			});
		},
		onShow: function() {
			console.log(this.$socketIo.disconnected)
			if (this.$socketIo.disconnected) {
				this.$socketIo.connect();
			};
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	page { font-size: 26rpx;}
	/*每个页面公共css */
	image {width: auto; height: auto;}
	.d-flex {display: flex; align-items: center;}  
	.d-flex-jsb {display: flex; justify-content: space-between; align-items: center;}
	.d-flex-center {display: flex; justify-content: center; align-items: center;}
	.fw-bold {font-weight: bold;}
	.fs-10 {font-size: 20rpx;}
	.fs-11 {font-size: 22rpx;}
	.fs-12 {font-size: 24rpx;}
	.fs-13 {font-size: 26rpx;}
	.fs-14 {font-size: 28rpx;}
	.fs-15 {font-size: 30rpx;}
	.fs-16 {font-size: 32rpx;}
	.fs-17 {font-size: 34rpx;}
	.fs-18 {font-size: 36rpx;}
	.fs-19 {font-size: 38rpx;}
	.fs-20 {font-size: 40rpx;}
	.container { padding: 0 44rpx;}
	.cover { position: fixed; width: 100%; height: 100%; background: rgba(0,0,0, 0.5); left: 0; top: 0;}
	.page-top { border-top: 19rpx solid #F4F6F8;}
	
	.pk {
		text-align: center;
		line-height: 114rpx;
		font-size: 36rpx;
		height: 114rpx;
		background: linear-gradient(180deg, #01DAA5, #03B97E);
		border-radius: 57px;
		color: #FFFFFF;
		margin-top: 114rpx;
	}
	
	.no-more {
		text-align: center;
		padding: 20rpx 0;
		color: #949492;
		font-size: 24rpx;
	}
	
	.rich-txt{
		word-break: break-all;
		white-space: pre-warp;
	}
</style>
