<template>
	<view style="position:relative;height: 100%">
		<view v-if="!!curItem" class="dialog-mask">
			<view class="dialog">
				<view class="dialog-content">
					<view class="dialog-detail">
						点击选择
					</view>
					<view class="dialog-bottom">
						<view @tap="del">删除任务</view>
						<view @tap="goDetail">查看详情</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-list">
			<view class="order-item d-flex-jsb" v-for="(d, i) in list" :key="i" @click="toDetail(d)">
				<view class="order-tag">
					<view class="ing" v-if="d.status==0">发布中</view>
					<view class="ing" v-else-if="d.status==2">进行中</view>
					<image src="../../static/ying.png" v-else-if="d.win_lose==1" mode="widthFix"></image>
					<image src="../../static/shu.png" v-else-if="d.win_lose==-1" mode="widthFix"></image>
				</view>
				<view class="order-l">
					<image :src="d.avatar" mode="widthFix"></image>
				</view>
				<view class="order-r d-flex-jsb">
					<view class="order-info">
						<view class="order-name">{{d.user_name}}</view>
						<view class="order-label d-flex">
							<view>{{d.pk_format}}</view>
							<view>{{d.type_name}}</view>
						</view>
					</view>
					<view class="order-price d-flex">
						<view class="pk-icon">
							<image src="../../static/pk.png" mode="widthFix"></image>
						</view>
						<view class="get-s d-flex">
							<!-- <image src="../../static/jian.png" v-if="d.win_lose==-1" mode="widthFix"></image>
							<image src="../../static/jia.png" v-else mode="widthFix"></image> -->
							<text>{{d.pk_price}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="no-more" v-if="!isData">~暂无更多~</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curItem: false,
				page: 1,
				isData: true,
				list: [],
			};
		},
		
		onLoad() {
			this.list =[]
			this.release();
		},
		
		methods:{
			release() {
				this.$utils.postrequest('/api/my/release', {page: this.page}, res => {
					if (res.code === 200) {
						this.list = [...this.list, ...res.data];
						if (res.data.length) {
							this.page++
						} else {
							this.isData = false;
						}
					} else {
						that.$utils.showLayer(res.message);
					}
				})
			},
			toDetail(data) {
				if (data.status == 0) {
					this.curItem = data;
				} else {
					uni.navigateTo({
					url: "/pages/index/pk?id=" + data.id
				})
				}
			},
			del() {
				this.$utils.postrequest('/api/my/release_delete', {id: this.curItem.id}, res => {
					if (res.code === 200) {
						this.page = 1;
						this.list =[]
						this.release();
					} else {
						that.$utils.showLayer(res.message);
					}
				});
				this.curItem = null;
			},
			goDetail(data) {
				uni.navigateTo({
					url: "/pages/index/pk?id=" + this.curItem.id
				})
				this.curItem = null;
			},
		},
		onReachBottom() {
			if (this.isData) {
				this.release()
			}
		}
	}
</script>

<style lang="less">
@import '../../styles/order.less';
page {
	background: #F4F6F8;
	height: 100%;
}

</style>
<style lang="less" scoped>
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
		width: 540rpx;
		height: 250rpx;
		background: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
		text-align: center;
		.dialog-detail {
			font-size: 28rpx;
			text-align: center;
			padding: 45rpx 0;
			color: #9a9a9a;
		}
		.dialog-bottom {
			display: flex;
			justify-content: space-between;
			view {
				padding: 40rpx 0;
				width: 50%;
				text-align: center;
				font-size: 32rpx;
				border-top: 1px solid #EFEFEF;
			}
			view:first-child {
				color: #FD3708;
				border-right: 1px solid #EFEFEF;
			}
		}
	}
</style>
