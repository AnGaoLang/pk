<template>
	<view style="position:relative;height: 100%">
		<view v-if="show" class="dialog-mask" @tap="show = false">
			<view class="dialog">
				<view class="dialog-content">
					<view class="dialog-detail">
						<image style="width: 100%;height: 100%;" mode="widthFix" src="../../static/kefu.png"></image>
					</view>
					<view class="dialog-bottom">{{telephone}}</view>
				</view>
			</view>
		</view>
		<view class="user-tab">
			<image src="../../static/user-bg.png" mode="widthFix"></image>
			<view class="user-tag">
				<view class="user-info d-flex">
					<view class="user-face">
						<image :src="userInfo.avatar" mode="widthFix"></image>
					</view>
					<view class="user-data">
						<view class="user-name">{{userInfo.name}}</view>
						<view>ID:{{userInfo.id}}</view>
					</view>
				</view>
			</view>
			<view class="edit-info" @click="toPage('./edit-info')">编辑资料</view>
			<view class="user-amount d-flex-jsb">
				<view class="amount-1">
					<view class="amount">{{userInfo.residual}}</view>
					<view class="amount-text">我的余额</view>
				</view>
				<view class="amount-1">
					<view class="amount">{{userInfo.earnings}}</view>
					<view class="amount-text">我的收益</view>
				</view>
			</view>
		</view>
		<view class="user-label d-flex">
			<view class="user-lab-item">
				<view class="label-icon" @click="toPage('./wallet')">
					<image src="../../static/l1.png" mode="widthFix"></image>
				</view>
				<text>我的钱包</text>
			</view>
			<view class="user-lab-item" @click="toPage('./geted')">
				<view class="label-icon">
					<image src="../../static/l2.png" mode="widthFix"></image>
				</view>
				<text>我的接单</text>
			</view>
			<view class="user-lab-item" @click="toPage('./pubed')">
				<view class="label-icon">
					<image src="../../static/l3.png" mode="widthFix"></image>
				</view>
				<text>我的发单</text>
			</view>
			<!-- <view class="user-lab-item" @click="invite"> -->
			<view class="user-lab-item" @click="toPage('./friends')">
				<view class="label-icon">
					<image src="../../static/l4.png" mode="widthFix"></image>
				</view>
				<text>邀请好友</text>
			</view>
		</view>
		<view class="user-ad">
			<image src="../../static/user-ad.png" mode="widthFix"></image>
		</view>
		<view class="opt-list">
			<view class="opt-item d-flex-jsb" @click="toPage('./edit-info')" style="border-top: 1px solid #f5f5f5;">
				<view class="opt-l d-flex">
					<view class="opt-icon">
						<image src="../../static/l5.png" mode="widthFix"></image>
					</view>
					<view>编辑资料</view>
				</view>
				<view class="icon-right">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="opt-item d-flex-jsb" @tap="show = true">
				<view class="opt-l d-flex">
					<view class="opt-icon">
						<image src="../../static/l6.png" mode="widthFix"></image>
					</view>
					<view>联系客服</view>
				</view>
				<view class="icon-right">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="opt-item d-flex-jsb" @click="toPage('./setting')">
				<view class="opt-l d-flex">
					<view class="opt-icon">
						<image src="../../static/l7.png" mode="widthFix"></image>
					</view>
					<view>我的设置</view>
				</view>
				<view class="icon-right">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<uni-footers :pag='5'></uni-footers>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				userInfo: {},
				telephone: '',
			};
		},
		
		onShow() {
			this.myinfo();
			this.getKefu();
		},
		
		methods: {
			myinfo() {
				this.$utils.postrequest('/api/myinfo', {}, res => {
					console.log(res);
					if (res.code === 200) {
						this.userInfo = res.data;
					}
				})
			},
			toPage(url) {
				console.log(url);
				uni.navigateTo({
					url,
				})
			},
			getKefu() {
				this.$utils.postrequest('/api/my/customer_service', {}, res => {
					console.log(res);
					if (res.code === 200) {
						this.telephone = res.data;
					}
				})
			},
			invite() {
				uni.reLaunch({
					url: '../index/invite'
				})
			},
		}
	}
</script>

<style lang="less">
page {
	height: 100%;
}
</style>
<style lang="less">
	.dialog-mask {
		background: rgba(0, 0, 0, 0.5);
		position: absolute;
		z-index: 999;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1000;
		padding: 20rpx 20rpx 50rpx 20rpx;
		width: 540rpx;
		height: 640rpx;
		background: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
		text-align: center;
		.dialog-detail {
			width: 500rpx;
			height: 430rpx;
		}
		.dialog-bottom {
			margin: 20rpx auto;
			width: 400rpx;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 10rpx;
			text-align: center;
			color: #fff;
			font-size: 32rpx;
			background: linear-gradient(#01DAA5, #03B97E);
		}
	}
	.user-info {
		color: #fff;
		
		.user-face {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 4px solid #40ca9d;
			margin-right: 20rpx;
		}
		
		.user-data {
			font-size: 22rpx;
			
			.user-name {
				font-size: 34rpx;
				margin-bottom: 20rpx;
			}
		}
	}
	.user-tab {
		margin: 32rpx;
		position: relative;

		image {
			width: 100%;
			display: block;
		}

		.user-tag {
			position: absolute;
			left: 40rpx;
			top: 32rpx;
		}

		.user-amount {
			position: absolute;
			bottom: 60rpx;
			text-align: center;
			width: 100%; 
			left: 0;

			&>view {
				width: 40%;
			}

			.amount {
				font-size: 40rpx;
				color: #fff;
				font-weight: bold;
			}

			.amount-text {

				opacity: 0.6;
				color: #CDFFCF;
			}
		}

		.edit-info {
			position: absolute;
			right: 0;
			top: 60rpx;
			width: 170rpx;
			height: 63rpx;
			color: #fff;
			text-indent: 20rpx;
			text-align: center;
			line-height: 63rpx;
			border-radius: 32px 4rpx 4rpx 32px;
			background: rgba(255, 255, 255, 0.3);
		}
	}

	.user-label {
		padding: 20rpx 32rpx 0;

		.user-lab-item {
			width: 25%;
			text-align: center;
			
			image {
				width: 50rpx; 
			}
		}
	}
	
	.user-ad {
		padding: 30rpx 70rpx 0;
		image {
			width: 100%;
		}
	}
	
	.opt-list {
		margin-top: 30rpx;
		padding: 0 32rpx;
		.opt-item {
			height: 106rpx;
			border-bottom: 1px solid #f5f5f5;
		}
		
		.opt-icon {
			image {
				width: 40rpx;
				margin-right: 27rpx;
			}
		}
		
		.icon-right {
			image {
				width: 11rpx;
			}
		}
	}
</style>
