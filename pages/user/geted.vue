<template>
	<view style="position:relative;height: 100%">
		<view v-if="!!upload" class="dialog-mask">
			<view class="uplod">
				<image mode="aspectFit" :src="uploadImage || '../../static/upload_demo.png'" @tap="uploadSnapShot"></image>
				<view class="upload-tip">
					<view>上传游戏截图</view>
					<view>接单任务完成需要上传比赛截图 后台判断输赢</view>
				</view>
				<view class="upload-btn" @tap="uploadConfirm">提交</view>
				<image class="upload-close" src="../../static/cuowu.png" @tap="upload = false"></image>
			</view>
		</view>
		<view v-if="!!curItem" class="dialog-mask" @tap="curItem = false">
			<view class="dialog">
				<view class="dialog-content">
					<view class="dialog-detail">
						点击选择
					</view>
					<view class="dialog-bottom">
						<view @tap.stop="del">删除任务</view>
						<view @tap.stop="goDetail">查看详情</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-list">
			<view class="order-item d-flex-jsb" v-for="(d, i) in list" :key="i" @click="toDetail(d)">
				<view class="order-tag">
					<image src="../../static/ying.png" v-if="d.win_lose==1" mode="widthFix"></image>
					<image src="../../static/shu.png" v-if="d.win_lose==-1" mode="widthFix"></image>
					<view class="ing" v-if="d.win_lose==0">进行中</view>
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
				upload: false,
				uploadImage: '',
				uploadId: '',
				curItem: false,
				page: 1,
				isData: true,
				list:[],
			};
		},
		
		onLoad() {
			this.list =[]
			this.pkorders();
		},
		
		methods:{
			showUpload(callback) {
				this.$utils.request('api/index/pk_upload_result', {}, (res) => {
					if (res.code == 200) {
						this.uploadId = res.data.id;
						callback();
					} else {
						this.$utils.showLayer(res.message);
					}
				});
			},
			uploadSnapShot() {
				var that = this
				uni.chooseImage({ //选中本地图片
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: res => {
						uni.showLoading({ //加载框
							title: '加载中...'
						})
						const tempFilePaths = res.tempFilePaths;
							uni.uploadFile({
								// url: 'http://vr.hualin688.com/api/upload', //上传接口地址
								url: that.$url.url_config+'api/upload', //上传接口地址
								filePath: tempFilePaths[0],
								name: 'file',
								header:{
									"Authorization": 'Bearer ' + wx.getStorageSync('token')
								},
								success: (res) => {
									let data = JSON.parse(res.data);
									uni.hideLoading();
									if(data.code==200){
										that.uploadImage = data.data;
									}else{
										uni.showToast({
											title: res.message,
											icon:'none',
											duration: 2000
										});
									}
								},
								fail(err) {
									uni.hideLoading();
									console.log(err);
									uni.showToast({
										title: '上传失败',
										icon:'none',
										duration: 2000
									});
								}
							});
					}
				});
			},
			uploadConfirm() {
				var that = this
				that.$utils.postrequest('api/index/pk_submit', {
					id: that.uploadId,
					image: that.uploadImage,
				}, function(res) {
					if (res.code == 200) {
						that.upload = false;
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
			toDetail(data) {
				if (data.status == 2) {
					this.showUpload(() => {
						this.upload = true;
						this.curItem = null;
					})
					return;
				} else {
					this.curItem = data;
				}
				// if (data.status == 0) {
				// 	this.curItem = data;
				// } else {
				// 	uni.navigateTo({
				// 		url: "/pages/index/pk?id=" + data.id,
				// 	})
				// }
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
			pkorders() {
				this.$utils.postrequest('/api/my/pkorders', {page: this.page}, res => {
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
			}
		},
		onReachBottom() {
			if (this.isData) {
				this.pkorders()
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
	.uplod {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1000;
		padding: 90rpx 30rpx 40rpx;
		width: 520rpx;
		height: 690rpx;
		background: #fff;
		border-radius: 50rpx;
		box-sizing: border-box;
		text-align: center;
		image {
			margin-bottom: 30rpx;
			width: 460rpx;
			height: 260rpx;
		}
		.upload-tip {
			margin: auto;
			font-size: 38rpx;
			text-align: center;
			view:last-child {
				margin: auto;
				width: 70%;
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #B8B8B8;
			}
		}
		.upload-btn {
			margin: auto;
			display: inline-block;
			padding: 25rpx 110rpx;
			margin-top: 30rpx;
			font-size: 38rpx;
			color: #fff;
			border-radius: 100rpx;
			background: linear-gradient(#01DAA5, #03B97E);
		}
		.upload-close {
			position: absolute;
			bottom: -110rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 50rpx;
			height: 50rpx;
		}
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
