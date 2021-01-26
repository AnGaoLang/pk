<template>
	<view class="" :style="`position:relative;height: 100%;padding-top: ${statusBar}px;`">
		<view v-if="!!upload" class="dialog-mask">
			<view class="uplod">
				<image mode="heightFix" :src="uploadImage || '../../static/upload_demo.png'" @tap="uploadSnapShot"></image>
				<view class="upload-tip">
					<view>上传游戏截图</view>
					<view>接单任务完成需要上传比赛截图 后台判断输赢</view>
				</view>
				<view class="upload-btn" @tap="uploadConfirm">提交</view>
				<image class="upload-close" src="../../static/cuowu.png" @tap="upload = false"></image>
			</view>
		</view>
		<view class="leval-tab d-flex">
			<view :class="active==99?'active':''" @click="serachDW('',99)">推荐</view>
			<view v-for="(item,index) in tuijianData" :key="item.id" :class="active==index?'active':''"  @click="serachDW(item,index,2)">{{item.type_name}}</view>
		</view>
		<view class="search-his d-flex-jsb">
			<view class="search d-flex">
				<image src="../../static/sousuo.png" mode="widthFix"></image>
				<input placeholder="搜索玩家昵称" @confirm="bindInput"  confirm-hold="true" type="text" v-model="search" confirm-type="search">
			</view>
			<view class="his">
				<image src="../../static/shizhong.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="banner" style="height: 120px;overflow: hidden;">
			<image :src="bannerImg" style="width:100%;height: 120px;" mode="widthFix"></image>
		</view>
		<view class="order-list">
			<view class="order-item d-flex-jsb" v-for="(item,index) in tuijianDataList" :key="item.id" @click="toDetail(item)">
				<view class="order-l">
					<image :src="item.avatar" mode="widthFix"></image>
				</view>
				<view class="order-r d-flex-jsb" >
					<view class="order-info">
						<view class="order-name">{{ item.pk_name }}</view>
						<view class="order-label d-flex">
							<view>{{ item.pk_format }}</view>
							<view>{{ item.type_name }}</view>
						</view>
					</view>
					<view class="order-price d-flex" >
						<view class="pk-icon">
							<!--  -->
							<image src="../../static/pk.png" mode="widthFix"></image>
						</view>
						<view class="get-s d-flex">
							<image src="../../static/jia.png" mode="widthFix"></image>
							<text>{{item.pk_price}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-footers :pag='1'></uni-footers>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				upload: false,
				uploadImage: '',
				uploadId: '',
				statusBar: 0,
				active: 99,
				title: 'Hello',
				tuijianData:[],
				bannerImg:'',
				tuijianDataList:[],
				search:'',
				type_id: ''
			}
		},
		onLoad() {
			if (this.$socketIo.disconnected) {
				this.$socketIo.connect();
			};
			this.statusBar = uni.getSystemInfoSync().statusBarHeight;
			this.showUpload();
			this.getTuijian();
			this.getTuijianList();
		},
		onPullDownRefresh() {
			this.statusBar = uni.getSystemInfoSync().statusBarHeight;
			this.showUpload();
			this.getTuijian();
			this.getTuijianList();
		},
		methods: {
			showUpload() {
				let that= this;
				this.$utils.request('api/index/pk_upload_result', {}, function(res) {
					if (res.code == 200) {
						that.upload = res.data.is_screenshot == 1;
						that.uploadId = res.data.id;
					} else {
						that.$utils.showLayer(res.message);
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
				uni.navigateTo({
					url: "./pk?id=" +data.id
				})
			},
			getTuijian(){
				let that= this;
		
				this.$utils.request('api/', {}, function(res) {
					if (res.code == 200) {
						that.tuijianData = res.data.type;
						that.bannerImg = res.data.banner.image;
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
			bindInput: function(e) {
				var that = this;
				var keywords = e.detail.value;
				this.search = keywords
				this.getTuijianList();
			},
			serachDW(data,index){
				this.type_id = data.id;
				this.active = index
				this.getTuijianList();
			},
			getTuijianList(){
				let that= this;
				let obj={
					type_id: this.type_id,
					search: this.search,
				}
				this.$utils.postrequest('api/index/getpklist', obj, function(res) {
					if (res.code == 200) {
						that.tuijianDataList = res.data;
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
	}
	.greenBg {
		background: linear-gradient(#01DAA5, #03B97E);
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
		width: 540rpx;
		height: 830rpx;
		background: linear-gradient(#01DAA5, #03B97E);
		padding: 0 20rpx 20rpx 20rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		.dialog-head {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 40rpx;
			color: #fff;
			text-align: center;
		}
		.dialog-content {
			padding: 20rpx;
			background: #fff;
			height: 700rpx;
			box-sizing: border-box;
			.avator {
				display: flex;
				align-items: center;
				.avator-left {
					margin-right: 16rpx;
					width: 110rpx;
					height: 110rpx;
					border-radius: 100%;
					border: 1px solid #fafafa;
				}
				.avator-right {
					.grade {
						display: inline-block;
						vertical-align: middle;
						margin-top: 10rpx;
						padding: 8rpx 16rpx;
						border-radius: 25rpx;
						font-size: 20rpx;
						color: #fff;
					}
					.avator-right-title {
						display: flex;
						align-items: center;
						font-size: 32rpx;
						font-weight: bold;
						.greenBg {
							margin-left: 10rpx;
							font-size: 20rpx;
							padding: 2rpx 10rpx;
							color: #fff;
							font-weight: normal;
							border-radius: 6rpx;
						}
						
					}
				}
			}
			.dialog-image {
				width: 100%;
				height: 220rpx;
			}
			.dialog-detail {
				margin-top: 45rpx;
				font-size: 28rpx;
				line-height: 1.5;
				view {
					margin-bottom: 10rpx;
				}
				view:first-child {
					color: #FD3708;
				}
			}
		}
		.dialog-bottom {
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			view {
				padding: 20rpx 70rpx;
				border-radius: 70rpx;
			}
			view:first-child {
				color: #5B3A3B;
				background: #EFEFEF;
			}
			view:last-child {
				color: #fff;
				background: linear-gradient(#01DAA5, #03B97E);
			}
		}
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
		height: ;
		background: #fff;
		border-radius: 50rpx;
		box-sizing: border-box;
		text-align: center;
		image {
			margin-bottom: 30rpx;
			width: auto;
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
	.leval-tab {
		padding-left: 28rpx;
		font-size: 36rpx;

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

	.search-his {
		margin: 50rpx 30rpx 0;

		.search {
			width: calc(100% - 70rpx);
			height: 69rpx;
			background: #F9F9F9;
			border-radius: 16rpx;

			input {
				font-size: 26rpx;
			}

			image {
				margin-left: 31rpx;
				margin-right: 26rpx;
				width: 24rpx
			}
		}

		.his {
			display: flex;
			justify-content: flex-end;
			align-items: center;

			image {
				width: 36rpx;
			}
		}
	}

	.banner {
		margin: 34rpx 30rpx 0;

		image {
			width: 100%;
		}
	}

	.order-item {
		border-bottom: 1px solid #ECE9E9;
		padding: 26rpx 28rpx;

		.order-l {
			width: 110rpx;
			height: 110rpx;
			border-radius: 50%;
			background: #eee;
			overflow: hidden;

			image {
				width: 100%;
			}
		}

		.order-r {
			width: calc(100% - 124rpx);

			.order-name {
				color: #2B2937;
				font-size: 28rpx;
				font-weight: bold;
			}

			.order-label {
				margin-top: 16rpx;

				view {
					height: 33rpx;
					line-height: 33rpx;
					color: #fff;
					font-size: 16rpx;
					padding: 0 20rpx;
					margin-right: 13rpx
				}

				&>view:nth-child(1) {
					background: linear-gradient(165deg, #FFA008, #FF8305);
					border-radius: 17px;
				}

				&>view:nth-child(2) {

					background: linear-gradient(165deg, #01DAA5, #03B97E);
					border-radius: 17px;
				}
			}

			.pk-icon {
				width: 78rpx;

				image {
					width: 78rpx;
				}
			}

			.get-s {
				margin-left: 36rpx;
				color: #FF9507;
				font-weight: 800;
				font-size: 45rpx;

				image {
					width: 16rpx;
				}
			}
		}
	}
</style>
