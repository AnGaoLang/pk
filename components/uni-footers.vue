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
			<text :class="pag == 2?'active':''">消息</text>
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
	export default {
		props:{
			pag:{}
		},
		data() {
			return {

			};
		},
		
		methods: {
			toPages(url) {
				uni.reLaunch({
					url,
				})
			}
		}
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
</style>
