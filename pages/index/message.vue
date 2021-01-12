<template>
	<view :style="`padding-top: ${statusBar}px;`" class="page">
		<view class="leval-tab d-flex">
			<view class="active">消息</view>
		</view>
		<scroll-view scroll-y="true" class="list" @scrolltolower="lower">
			<view class="item" v-for="(t,i) in list">
				<view class="left">
					<view class="head-box">
						<image :src="t.avatar" class="head" mode="widthFix"></image>
					</view>
					<view class="info">
						<view class="name">{{t.name}}</view>
						<view class="num">{{'消息消息消息消息'}}</view>
					</view>
				</view>
				<view class="right">
					<text class="time">08:12</text>
					<text class="circle">2</text>
				</view>
			</view>
			<view class="no-more" v-if="!isData">~暂无更多消息~</view>
		</scroll-view>
		<uni-footers :pag='2'></uni-footers>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
			};
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
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
