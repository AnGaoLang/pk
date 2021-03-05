<template>
	<view class="custom-footer d-flex">
		<view class="m1" @click="toPages('/pages/index/index')">
			<view class="footer-icon">
				<image src="../static/i1-a.png" mode="widthFix" v-if="pag==1"></image>
				<image src="../static/i1.png" mode="widthFix" v-else></image>
			</view>
			<text :class="pag == 1?'active':''">首页</text>
		</view>
		<view class="m1" @click="toPages('/pages/tim/record')">
			<view class="footer-icon">
				<image src="../static/i2-a.png" mode="widthFix" v-if="pag==2"></image>
				<image src="../static/i2.png" mode="widthFix" v-else></image>
			</view>
			<text :class="pag == 2?'active':''">
				消息
				<text v-if="unRead" class="circle">{{unRead}}</text>
			</text>
		</view>
		<view class="m2" @click="toPages('/pages/order/pub')">
			<view class="footer-icon">
				<image src="../static/i3.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="m1" @click="toPages('/pages/index/invite')">
			<view class="footer-icon">
				<image src="../static/i4-a.png" mode="widthFix" v-if="pag==4"></image>
				<image src="../static/i4.png" mode="widthFix" v-else></image>
			</view>
			<text :class="pag == 4?'active':''">分享</text>
		</view>
		<view class="m1" @click="toPages('/pages/user/user')">
			<view class="footer-icon">
				<image src="../static/i5-2.png" mode="widthFix" v-if="pag==5"></image>
				<image src="../static/i5.png" mode="widthFix" v-else></image>
			</view>
			<text :class="pag == 5?'active':''">我的</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	
	export default {
		data() {
			return {
				userAddConversationList: [],
				unRead: 0,
			}
		},
		props:{
			pag:{},
			// unRead: {
			// 	type: Number,
			// 	default: 0
			// },
		},
		computed: {
			...mapState({
				isLogin: state => state.isLogin,
				isSDKReady: state => state.isSDKReady,
				conversationList: state => state.conversationList,
			}),
		},
		methods: {
			toPages(url) {
				uni.reLaunch({
					url,
				})
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
				});
				this.unRead = this.userAddConversationList.reduce((total, item) => {
					return total + Number(item.conversation.unreadCount) || 0
				}, 0)
			},
		},
		watch: {
			conversationList(val){
				console.log('conversationList', val)
				this.getUserInfo(val)
			}
		
		},
	}
</script>

<style lang="less">
	page {
		padding-bottom: 102rpx;
	}
	.custom-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #fff;
		height: 102rpx;
		border-top: 1px solid #B9C3C0;
		font-size: 18rpx;
		color: #C6C6D0;

		&>view {
			width: 20%;
			text-align: center;
			display: block;
		}

		.m1 {
			.footer-icon {
				width: 32rpx;
				height: 32rpx;
				margin: 0 auto 6rpx;
				border-radius: 3px;
			}
			.active{
				color: #03BA7F;
			}
		}
		
		.m2 {
			.footer-icon {
				margin: auto;
				width: 70rpx;
			}
		}

		.footer-icon {
			image {
				width: 100%;
			}
		}
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
</style>
