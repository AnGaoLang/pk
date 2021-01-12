<template>
	<view>
		<view class="wallet-bg">
			<image class="b1" src="../../static/wallet-bg.png" mode="widthFix"></image>
			<view class="wallet-info d-flex">
				<view class="wallet-item">
					<view class="wallet-label">我的总余额</view>
					<view class="wallet-amount d-flex-center">
						<text>￥</text>
						<view>{{walletInfo.residual}}</view>
					</view>
				</view>
				<view class="wallet-item">
					<view class="wallet-label">总提现金额</view>
					<view class="wallet-amount d-flex-center">
						<text>￥</text>
						<view>{{walletInfo.Withdrawal}}</view>
					</view>
				</view>
			</view>
			<view class="wallet-opt d-flex">
				<view class="wallet-opt-btn d-flex-center" @click="toRechage">
					<image src="../../static/in-cash.png" mode="widthFix"></image>
					<text>点击充值</text>
				</view>
				<view class="wallet-opt-btn d-flex-center" @click="toWithDraw">
					<image src="../../static/get-cash.png" mode="widthFix"></image>
					<text>点击提现</text>
				</view>
			</view>
		</view>

		<view class="record">
			<view class="record-title">我的账单</view>
			<view class="record-list">
				<view class="record-item d-flex-jsb" v-for="(d, i) in bill" :key="i">
					<view class="record-l d-flex">
						<view class="record-icon">
							<image src="../../static/record.png" mode="widthFix"></image>
						</view>
						<view class="record-info">
							<view class="record-title-b">{{d.describe}}</view>
							<view class="record-date">{{d.created_at}}</view>
						</view>
					</view>
					<view class="record-r d-flex">
						<text>{{ Number(d.price)>0?'+':'-'}}</text>
						<view>{{d.price}}</view>
					</view>
				</view>
				<view class="no-more" v-if="hasNone">~暂无更多~</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				walletInfo: {},
				bill: [],
				hasNone:false
			};
		},
		
		onShow() {
			this.bill = [];
			this.walletIndex()
			this.walletBill()
		},

		methods: {
			walletBill() {
				if(this.hasNone){
					return;
				}
				this.$utils.postrequest('/api/user/wallet/bill', {}, res => {
					if (res.code === 200) {
						if(res.data==''){
							this.hasNone = true;
						}else{
							this.bill = [...this.bill, ...res.data]
						}
					}
				})
			},
			walletIndex() {
				this.$utils.postrequest('/api/user/wallet/index', {}, res => {
					if (res.code === 200) {
						this.walletInfo = res.data;
					}
				})
			},
			toWithDraw() {
				uni.navigateTo({
					url: './withdraw'
				})
			},
			
			toRechage() {
				uni.navigateTo({
					url: './reacharge'
				})
			},
		},
		
		onReachBottom() {
			this.walletBill()
		},
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
	}

	.wallet-opt {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.wallet-item {
		width: 50%;
		text-align: center;
		color: #fff;

		.wallet-label {
			font-size: 32rpx;
		}

		.wallet-amount {
			margin-top: 10rpx;

			view {
				font-size: 48rpx;
				font-weight: bold;
			}
		}
	}

	.wallet-opt-btn {
		width: 50%;
		height: 101rpx;
		font-size: 32rpx;
		border-top: 1px solid rgba(255, 255, 255, 0.5);
		color: #fff;

		text {
			height: 101rpx;
			line-height: 96rpx;
		}

		image {
			width: 41rpx;
			margin-right: 20rpx;
			display: black;
		}
	}

	.record {
		padding: 0 30rpx;
	}

	.record-title {
		font-size: 34rpx;
		margin-top: 35rpx;

	}

	.record-item {
		padding: 34rpx 0;
		border-bottom: 1px solid rgba(220, 220, 220, 0.3);
		align-items: start;

		.record-icon {
			margin-right: 20rpx;
			width: 76rpx;

			image {
				display: block;
				width: 76rpx;
			}
		}

		.record-title {
			font-size: 26rpx;
		}

		.record-date {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: #A2A1A0;
		}

		.record-r {
			font-size: 33rpx;
			font-weight: bold;

			text {
				margin-top: 6rpx;
				font-size: 24rpx;
			}
		}
	}

	
</style>
