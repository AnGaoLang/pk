<template>
	<view :style="`position: relative;height: 100%;padding-top: ${statusBar}px;`" class="page">
		<view class="leval-tab d-flex" :style="`padding-top: ${statusBar}px;`">
			<view class="active">消息</view>
		</view>
		<!-- 聊天记录 会话列表 -->
		<scroll-view scroll-y="true" class="list">
			<view class="item" v-for="(item,index) in userAddConversationList" :key="index" @click="toRoom(item)">
				<view class="left">
					<view class="head-box">
						<image :src="item.user.img" class="head" mode="widthFix"></image>
					</view>
					<view class="info">
						<view class="name">{{item.user.user}}</view>
						<rich-text :nodes="nodesFliter(item.conversation.lastMessage.messageForShow)"></rich-text>
						<!-- <view class="num">{{'消息消息消息消息'}}</view> -->
					</view>
				</view>
				<view class="right">
					<text class="time">{{timeFliter(item.conversation.lastMessage.lastTime)}}</text>
					<text v-if="item.conversation.unreadCount" class="circle">{{item.conversation.unreadCount}}</text>
				</view>
			</view>
			<!-- <view class="no-more" v-if="!isData">~暂无更多消息~</view> -->
			
			
			<!-- <view class="list-box" v-if="userAddConversationList.length>0">
				<view class="item-box" v-for="(item,index) in userAddConversationList" :key="index" @click="toRoom(item)">
					<view class="item-img">
						<img :src="item.user.img" alt="">
					</view>
					<view class="item-text">
						<view class="item-user">
							{{item.user.user}}
						</view>
						<view class="item-text-info">
							<rich-text :nodes="nodesFliter(item.conversation.lastMessage.messageForShow)"></rich-text>
						</view>
					</view>
					<view class="item-msg">
						<view class="item-msg-icon" v-if="item.conversation.unreadCount">{{item.conversation.unreadCount}}</view>
					</view>
				</view>
			</view>
			<view class="list-box" v-else>
				<span class="msg-box">~暂无更多消息~</span>
			</view> -->
		</scroll-view>
		<!-- 好友列表 -->
		<!-- <view class="user-box" v-if="isActive ==1">
			<view class="list-box">
				<view class="user-item-box" v-for="(item,index) in friendList" :key="index" @click="checkUserToRoom(item)">
					<view class="user-img">
						<image :src="item.img" alt=""></image>
					</view>
					<view class="user-name">
						{{item.user}}
					</view>
				</view>
			</view>
		</view> -->
		
		<uni-footers :pag='2' :unRead="unRead"></uni-footers>
	</view>
</template>

<script>
	import userList from '../../commen/tim/user.js'
	import {
		mapState
	} from "vuex";
	export default {
		name: 'record',
		data() {
			return {
				// conversationList: [],
				statusBar: 0,
				userList: userList,
				friendList:[],
				isActive: 0, //默认聊天记录
				userAddConversationList:[]
			}
		},
		computed: {
			...mapState({
				isLogin: state => state.isLogin,
				isSDKReady: state => state.isSDKReady,
				conversationList: state => state.conversationList,
			}),
			unRead() {
				return this.userAddConversationList.reduce((total, item) => {
					return total + Number(item.conversation.unreadCount) || 0
				}, 0)
			},
		},
		watch: {
			isSDKReady(val) {
				//isSDKReady == true 请求会话列表
				if (val) {
					this.getConversationList()
				}
			},
			conversationList(val){
				console.log(val)
				this.getUserInfo(val)
			}

		},
		methods: {
			//注销登录
			timeFliter(timer){
				let timeData = new Date(timer*1000)
				let str = this.$commen.dateTimeFliter(timeData)		 
				return str
			},
			outLoginBtn(){
				let promise = this.tim.logout();
				promise.then(res=> {
					this.$store.commit('reset')
					uni.reLaunch({
						url: '../index/index'
					})
				}).catch(err=> {
				   console.log('退出失败')
				});
			},
			//聊天的节点加上外层的div
			nodesFliter(str){
				let nodeStr = '<div style="align-items: center;word-wrap:break-word;">'+str+'</div>' 
				return nodeStr
			},
			//切换tab
			changeTabBtn(_index) {
				this.isActive = _index
				if (this.isSDKReady) {
					this.getConversationList()
				}
			},
			//获取消息列表
			getConversationList() {
				// 拉取会话列表
				let promise = this.tim.getConversationList();
				promise.then((res) => {
					let conversationList = res.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
					if (conversationList.length) {
						//将返回的会话列表拼接上 用户的基本资料  
						//说明：如果已经将用户信息 提交到tim服务端了 就不需要再次拼接
						this.$store.commit("updateConversationList", conversationList);
					};
				}).catch((err) => {
					console.warn('getConversationList error:', err); // 获取会话列表失败的相关信息
				});
			},
			//根据消息列表请求聊天对象的用户信息 并完成数据拼接
			getUserInfo(conversationList) {
				 this.userAddConversationList = []
				conversationList.forEach(item => {
					let obj = {}
					obj.conversation = item;
					obj.user = {
						user: item.userProfile.nick,
						userId: item.userProfile.userID,
						img: item.userProfile.avatar,
					}
					this.userAddConversationList.push(JSON.parse(JSON.stringify(obj)))
				})
			},
			toRoom(item) {
				this.$store.commit('updateConversationActive', item)
				uni.navigateTo({
					url: '/pages/tim/room'
				})
			},
			//选择用户聊天
			checkUserToRoom(toUserInfo) {
				this.$store.commit('createConversationActive', toUserInfo.userId)				
				uni.navigateTo({
					url: './room'
				})
			}
		},
		onShow() {
			if (this.isSDKReady) {
				this.getConversationList()
			}else{
			}
		},
		onLoad(){
			let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			this.friendList = []
			this.statusBar = uni.getSystemInfoSync().statusBarHeight;
			userList.forEach(item=>{
				if(item.userId != userInfo.userId){
					this.friendList.push(item)
				}
			})
			
		}
	}
</script>


<style lang="scss">
page {
	height: 100%;
}
.leval-tab {
		padding-left: 28rpx;
		font-size: 36rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 2;
		view {
			margin-right: 50rpx;
		}

		&>view:last-child {
			margin: 0;
		}

		.active {
			font-size: 40rpx;
			color: #333;
			font-weight: bold;
			position: relative;
		}

		.active::after {
			content: "";
			position: absolute;
			left: 50%;
			bottom: -20rpx;
			transform: translateX(-50%);
			width: 22rpx;
			height: 9rpx;
			background: #03BA80;
			border-radius: 5px;
		}
	}
	.page{
		position: relative;
		height: 100vh;
		box-sizing: border-box;
		.line{
			position: absolute;
			width: 100%;
			height: 20rpx;
			left: 0;
			top: 0;
			background: #F4F6F8;
		}
		.list{
			height: 100%;
			padding-top: 80rpx;
			padding-bottom: 100rpx;
			box-sizing: border-box;
			.item{
				width: 100%;
				height: 170rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 32rpx;
				.left{
					display: flex;
					align-items: center;
					.head-box{
						width: 110rpx;
						height: 110rpx;
						border-radius: 50%;
						overflow: hidden;
						.head{
							width: 100%;
						}
					}
					.info{
						width: 400rpx;
						margin-left: 16rpx;
						.name{
							font-size: 28rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #2B2937;
							line-height: 44rpx;
						}
						.num{
							font-size: 22rpx;
							font-family: PingFang SC;
							color: #A9A8AB;
						}
					}
				}
				.right{
					text-align: right;
					.time{
						font-size: 25rpx;
						font-family: PingFang SC;
						color: #AAAAAA;
						display: block;
					}
					.circle{
						padding: 0 8rpx;
						height: 34rpx;
						background: #FF4335;
						border-radius: 50%;
						text-align: center;
						font-size: 25rpx;
						font-family: SimHei;
						color: #FFFFFF;
						line-height: 34rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>