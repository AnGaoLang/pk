<template>
	<view style="position:relative;height: 100%">
		<view class="wallet-bg">
			<image class="b1" src="../../static/wallet-bg.png" mode="widthFix"></image>
			<view class="wallet-info">
				<view class="wallet-amount d-flex-center">
					<text>￥</text>
					<view>{{money}}</view>
				</view>
				<view class="wallet-label">可用金额</view>
			</view>
		</view>
		<view class="amount-input">
			<view class="input-title">提现金额</view>
			<view class="input d-flex-jsb">
				<view class="input-l d-flex">
					<image src="../../static/amount.png" mode="widthFix"></image>
					<input type="number" v-model="wdl_price" auto-focus>
				</view>
				<view class="clear" @click="clearAmount">
					<image src="../../static/clear.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="pay-title">请选择付款方式</view>
		<view class="pay-choose">
			<view class="pay-item d-flex-jsb" @click="setType(1)">
				<view class="pay-l d-flex">
					<image src='../../static/wx1.png' mode="widthFix"></image>
					<view class="pay-item-info">
						<view>微信支付</view>
						<text>提现到微信,方便快捷</text>
					</view>
				</view>
				<view class="choose">
					<image v-if="wdl_type === 1" src="../../static/checked.png" mode="widthFix"></image>
					<image v-if="wdl_type === 2" src="../../static/check-2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="pay-item d-flex-jsb" @click="setType(2)">
				<view class="pay-l d-flex">
					<image src='../../static/zfb.png' mode="widthFix"></image>
					<view class="pay-item-info">
						<view>支付宝支付</view>
						<text>推荐有支付宝账号的用户使用</text>
					</view>
				</view>
				<view class="choose">
					<image v-if="wdl_type === 2" src="../../static/checked.png" mode="widthFix"></image>
					<image v-if="wdl_type === 1" src="../../static/check-2.png" mode="widthFix"></image>
				</view>
			</view>
			
			<view class="pk" @click="withdrawAdd">确认提现</view>
		</view>
		
		<view v-if="show" class="dialog-mask" @tap="show = false">
			<view class="dialog">
				<view class="dialog-content">
					<view class="dialog-detail">
						<image style="width: 100%;height: 100%;" mode="widthFix" src="../../static/withDraw.png"></image>
					</view>
					<view class="dialog-text">客服微信</view>
					<view class="dialog-bottom">{{telephone}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				telephone: '',
				show: false,
				wdl_price: '',
				money: 0,
				wdl_type: 1,
			};
		},
		
		onShow() {
			this.withdraw();
			this.getKefu();
		},
		
		watch: {
			wdl_price() {
				this.wdl_price = '' + this.wdl_price
				if (this.wdl_price.includes('.')) {
					setTimeout(_ => {
						this.wdl_price = this.wdl_price.match(/\d+\.\d{0,2}/g)[0]
					})
				}
			}
		},
		
		methods: {
			setType(type) {
				this.wdl_type = type;
			},
			getKefu() {
				this.$utils.postrequest('/api/my/customer_service', {}, res => {
					console.log(res);
					if (res.code === 200) {
						this.telephone = res.data;
					}
				})
			},
			withdrawAdd() {
				let {wdl_type, wdl_price, money} = this;
				if (wdl_type == 1) {
					this.show = true;
					return;
				}
				if (parseFloat(wdl_price) <= 0) {
					this.$utils.showLayer('暂无可提现余额');
					return;
				}
				
				if (parseFloat(wdl_price) > parseFloat(money)) {
					this.wdl_price = parseFloat(money)
				};
				
				this.$utils.postrequest('/api/user/wallet/withdrawal_add', {wdl_type, wdl_price}, res => {
					this.$utils.showLayer(res.message);
					if (res.code === 200) {
						this.withdraw()
					} else if (res.code === 304) {
						uni.navigateTo({
							url: '/pages/user/edit-info'
						})
					}
				})
			},
			withdraw() {
				this.$utils.postrequest('/api/user/wallet/withdrawal_index', {}, res => {
					if (res.code === 200) {
						this.money = res.data;
					}
				})
			},
			clearAmount() {
				this.wdl_price = 0;
			}
		}
	}
</script>

<style lang="less">
page {
	height: 100%;
}
</style>
<style lang="less">
	.wallet-bg {
		position: relative;

		image {
			display: block;
		}
	}

	.b1 {
		width: 100%;
	}
	
	.wallet-info {
		position: absolute;
		top: 70rpx;
		left: 0;
		width: 100%;
		color: #fff;
	}
	
	.wallet-opt {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	
	
	.wallet-label {
		margin-top: 20rpx;
		font-size: 32rpx;
		text-align: center;
	}
	
	.wallet-amount  {
		margin-top: 20rpx;
		view {
			font-size: 60rpx;
			font-weight: bold;
		}
	}
	
	.amount-input,
	.pay-title,
	.pay-choose {
		padding: 0 30rpx;
	}
	
	.input-title {
		margin-top: 35rpx;
		font-size: 30rpx;
	}
	
	.input {
		padding: 27rpx 0 17rpx;
		// margin-top: 27rpx;
	}
	
	.input-l {
		image {
			width: 27rpx;
			margin-right: 20rpx;
		}
		
		input {
			font-size: 70rpx;
			font-weight: bold;
		}
	}
	
	.clear {
		image {
			width: 22rpx;
		}
	}
	
	.pay-title {
		height: 60rpx;
		line-height: 60rpx;
		background: #F7F4F8;
		font-size: 25rpx;
	}
	
	.pay-item {
		padding: 30rpx 0;
	}
	
	.pay-l {
		image {
			width: 76rpx;
			margin-right: 20rpx;
			display: block;
		}
		
		.pay-item-info {
			view {
				font-size: 30rpx;
				margin-bottom: 10rpx;
			}
			
			text {
				color: #949492;
				font-size: 24rpx;
			}
		}
	}
	
	.choose {
		image {
			width: 36rpx;
		}
	}
	
	.pay-item {
		border-bottom: 1px solid #E6E6E6;
	}
	
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
			height: 380rpx;
		}
		.dialog-text {
			font-size: 36rpx;
			color: #333;
			line-height: 68rpx;
			letter-spacing: 20rpx;
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
</style>
