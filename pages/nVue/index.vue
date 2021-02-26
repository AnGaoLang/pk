<template>
	<view class="dialog-mask">
		<view class="dialog">
			<view class="dialog-head"><text class="dialog-head-text">确认开始</text></view>
			<view class="dialog-content">
				<view class="avator">
					<image class="avator-left" :src="dialog.user_avatar"></image>
					<view class="avator-right">
						<view class="avator-right-title">
							<text class="avator-right-title-text">{{dialog.pk_name}}</text>
							<view class="greenBg" @tap="copy(dialog.pk_name)">
								<text class="copy-text">一键复制</text>
							</view>
						</view>
						<view class="greenBg grade">
							<text class="grade-text">{{dialog.type_name}}</text>
						</view>
					</view>
				</view>
				<image class="dialog-image" :src="dialog.game_home_image"></image>
				<view class="dialog-detail">
					<text class="dialog-detail-tips">温馨提示!</text>
					<text class="dialog-detail-warn">请认真审核对方游戏名称,若游戏内非该游戏名称，请放弃接单！</text>
				</view>
				<view class="dialog-bottom">
					<view class="dialog-bottom-cancel" @tap="cancel">
						<text class="dialog-cancel-text">拒绝</text>
					</view>
					<view class="dialog-bottom-confirm" @tap="confirmDialog">
						<text class="dialog-confirm-text">确认</text>
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/util.js'
	
	export default {
		data() {
			return {
				dialog: {},
			}
		},
		onLoad(options) {
			this.dialog = JSON.parse(options.dialog);
			setTimeout(() => { this.hide() }, 1000 * 2 * 60)
		},
		methods: {
			hide() {
				uni.navigateBack()
			},
			copy(data) {
				uni.setClipboardData({
					data: data
				});
			},
			cancel() {
				utils.request('/', {
					type: 'release_no',
					uid: this.dialog.user_id,
					pk_id: this.dialog.pk_id,
				}, (res) => {
					this.hide();
				}, 'http://45.125.45.234:5557');
			},
			confirmDialog() {
				utils.request('/', {
					type: 'release_yes',
					uid: this.dialog.user_id,
					pk_id: this.dialog.pk_id,
				}, (res) => {
					this.hide();
				}, 'http://45.125.45.234:5557');
			},
		},
	}
</script>

<style lang="less" scoped>
	.greenBg {
		margin-left: 10rpx;
		padding: 2rpx 10rpx;
		font-weight: normal;
		border-radius: 6rpx;
		background-color: #01DAA5;
	}
	.dialog-mask {
		position: fixed;
		z-index: 999;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}
	.dialog {
		width: 540rpx;
		height: 830rpx;
		background-color: #03B97E;
		padding-right: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 20rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
	}
	.dialog-head {
		width: 500rpx;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		justify-content: center;
	}
	.dialog-head-text {
		font-size: 21px;
		color: #fff;
		line-height: 100rpx;
		text-align: center;
	}
	.dialog-content {
		padding: 20rpx;
		background-color: #fff;
		height: 700rpx;
		box-sizing: border-box;
	}
	.avator {
		margin-bottom: 40rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.avator-left {
		flex-grow: 0;
		margin-right: 16rpx;
		width: 110rpx;
		height: 110rpx;
		border-width: 1px;
		border-style: solid;
		border-color: #eaeaea;
	}
	.avator-right {
		display: flex;
	}
	.grade {
		align-items: center;
		width: 70rpx;
		margin-top: 20rpx;
		border-radius: 70rpx;
	}
	.avator-right-title {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.avator-right-title-text {
		font-size: 17px;
		font-weight: bold;
	}
	.copy-text {
		font-size: 13px;
		color: #fff;
	}
	.grade-text {
		font-size: 13px;
		color: #fff;
	}
	.dialog-image {
		width: 460rpx;
		height: 220rpx;
		border-width: 1px;
		border-style: solid;
		border-color: #eaeaea;
	}
	.dialog-detail {
		margin-top: 45rpx;
		line-height: 1.5;
	}
	.dialog-detail-tips {
		color: #FD3708;
		margin-bottom: 10rpx;
		font-size: 14px;
	}
	.dialog-detail-warn {
		font-size: 14px;
	}
	.dialog-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 40rpx;
	}
	.dialog-bottom-cancel,.dialog-bottom-confirm {
		padding: 20rpx 70rpx;
		border-radius: 70rpx;
		background-color: #EFEFEF
	}
	.dialog-bottom-confirm {
		background-color: #03B97E;
	}
	.dialog-cancel-text,.dialog-confirm-text {
		color: #5B3A3B;
		font-size: 16px;
	}
	.dialog-confirm-text {
		color: #fff;
	}
	
</style>
