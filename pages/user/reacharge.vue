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
		<view class="recharge-tab">
			<view class="tabs d-flex-jsb">
				<view class="tab-item" @click="setPrice(50)" :class="{active: price === 50}">50元</view>
				<view class="tab-item" @click="setPrice(100)"  :class="{active: price === 100}">100元</view>
				<view class="tab-item" @click="setPrice(200)"  :class="{active: price === 200}">200元</view>
				<view class="tab-item" @click="setPrice(500)"  :class="{active: price === 500}">500元</view>
				<view class="tab-item" @click="setPrice(1000)"  :class="{active: price === 1000}">1000元</view>
				<view class="tab-item" @click="setPrice(2000)"  :class="{active: price === 2000}">2000元</view>
			</view>
			<view class="amount-input">
				<input type="text" v-model="custom" placeholder="自动输入金额">
			</view>
		</view>
		<view class="pay-choose">
			<!-- <view class="pay-item d-flex-jsb" @click="setType(1)">
				<view class="pay-l d-flex">
					<image src='../../static/wx1.png' mode="widthFix"></image>
					<view class="pay-item-info">
						<view>微信支付</view>
						<text>提现到微信,方便快捷</text>
					</view>
				</view>
				<view class="choose">
					<image v-if="type === 1" src="../../static/checked.png" mode="widthFix"></image>
					<image v-if="type === 2" src="../../static/check-2.png" mode="widthFix"></image>
				</view>
			</view> -->
			<view class="pay-item d-flex-jsb" @click="setType(2)">
				<view class="pay-l d-flex">
					<image src='../../static/zfb.png' mode="widthFix"></image>
					<view class="pay-item-info">
						<view>支付宝支付</view>
						<text>推荐有支付宝账号的用户使用</text>
					</view>
				</view>
				<view class="choose">
					<image v-if="type === 2" src="../../static/checked.png" mode="widthFix"></image>
					<image v-if="type === 1" src="../../static/check-2.png" mode="widthFix"></image>
				</view>
			</view>

			<view class="pk" @click="recharge">确认充值</view>
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
				money: 0,
				price: 50,
				custom: "",
				type: 2
			}
		},
		onShow() {
			this.withdraw();
			this.getKefu();
		},
		methods: {
			withdraw() {
				this.$utils.postrequest('/api/user/wallet/withdrawal_index', {}, res => {
					if (res.code === 200) {
						this.money = res.data;
					}
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
			recharge() {
				let { type } = this;
				if (type == 1) {
					this.show = true;
					return;
				};
				let price = Number(this.custom) || this.price;
				if (parseFloat(price) <= 0) {
					this.$utils.showLayer('请填写正确的金额');
					return;
				};
				this.$utils.postrequest('/api/user/wallet/pay_order', {price, type}, res => {
					if (res.code === 200) {
						if (this.type == 2) {
							this.$utils.postrequest('/api/user/wallet/alipay', {order_id: res.data}, res => {
								if (res.code === 200) {
									uni.requestPayment({
										provider: 'alipay',
										orderInfo: res.data,
										success: function (res) {
											console.log('success:' + JSON.stringify(res));
										},
										fail: function (err) {
											console.log('fail:' + JSON.stringify(err));
										}
									});
								} else {
									this.$utils.showLayer(res.message);
								}
							})
						} else {
							console.log('微信支付')
						}
					} else {
						this.$utils.showLayer(res.message);
					}
				})
			},
			setPrice(amount) {
				this.custom = "";
				this.price = amount;
			},
			setType(type) {
				this.type = type;
			},
		},
		
		watch: {
			custom(value) {
				if (Number(value)) {
					this.price = '';
				} else {
					this.price = 50;
				};
				this.custom = '' + this.custom
				if (this.custom.includes('.')) {
					setTimeout(_ => {
						this.price = this.custom.match(/\d+\.\d{0,2}/g)[0]
						this.custom = this.custom.match(/\d+\.\d{0,2}/g)[0]
					})
				}
				// this.price = parseFloat(this.custom)
			},
		}
	}
</script>

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
		top: 50rpx;
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
		margin-top: 10rpx;
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

	.pay-item {
		padding: 30rpx 0;
	}

	.amount-input,
	.pay-title,
	.pay-choose {
		padding: 0 30rpx;
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

	
	.recharge-tab {
		margin: -50rpx 30rpx 0;
		background: #fff;
		box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.09);
		position: relative;
		z-index: 2;
		border-radius: 30rpx;
		padding: 52rpx 26rpx 52rpx;
		.tabs {
			flex-wrap: wrap;
		}

		.tab-item {
			border-radius: 10rpx;
			border: 2rpx solid #02C68D;
			width: 31%;
			height: 130rpx;
			text-align: center;
			line-height: 130rpx;
			color: #02C68D;
			font-size: 40rpx;
			font-weight: bold;
			margin-bottom: 14rpx;
			
			&.active {
				background: #02C68D;
				color: #fff;
			}
		}
		
		.amount-input {
			margin-top: 30rpx;
			height: 103rpx;
			background: #F7F4F8;
			border-radius: 10rpx;
			
			input {
				height: 103rpx;
				width: 100%;
			}
		}
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
