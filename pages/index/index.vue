<template>
	<view class="" :style="`position:relative;height: 100%;padding-top: ${statusBar}px;`">
		<view v-if="!!dialog" class="dialog-mask">
			<view class="dialog">
				<view class="dialog-head">确认开始</view>
				<view class="dialog-content">
					<view class="avator">
						<view class="avator-left">
							<image style="width: 100%;height: 100%;" :src="dialog.user_avatar"></image>
						</view>
						<view class="avator-right">
							<view class="avator-right-title">
								<view>{{dialog.pk_name}}</view>
								<view class="greenBg">一键复制</view>
							</view>
							<view class="grade greenBg">{{dialog.type_name}}</view>
						</view>
					</view>
					<view class="dialog-detail">
						<view>1.请到王者→设置→隐私设置→战绩显示→打开</view>
						<view>2.如发现游戏主页面与游戏ID不符请放弃该PK</view>
						<view>3.请勿脱离平台交易</view>
						<view>4.可以选择双方确定开始PK后在进入游戏， 客服会根据实际的比赛记录判定，如果无属实记录会自动退回余额</view>
					</view>
					<view class="dialog-bottom">
						<view @tap="cancel">取消</view>
						<view @tap="confirmDialog">确认</view>
					</view>
				</view>
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
	import socketIo from '../../common/socket.js';
	
	export default {
		data() {
			return {
				timer: null,
				dialog: false,
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
			let uid = JSON.parse(uni.getStorageSync('userInfo')).id;
			socketIo.on('connect', () => {
				console.log('connect')
			  socketIo.emit('login', uid);
			});
			console.log(socketIo)
			socketIo.on('new_msg', (msg) => {
				let message = msg && JSON.parse(msg);
				if (message && message.order_user) {
					this.dialog = message.order_user;
					clearTimeout(this.timer)
					this.timer = setTimeout(() => {
						this.dialog = null;
					}, 2 * 60 * 1000)
				}
				if (message && message.data == 1) {
					console.log('同意')
				}
				if (message && message.data == 0) {
						console.log('不同意')
				}
			});
			this.statusBar = uni.getSystemInfoSync().statusBarHeight;
			this.getTuijian();
			this.getTuijianList();
		},
		methods: {
			cancel() {
				this.$utils.request('/', {
					type: 'release_no',
					uid: this.dialog.user_id,
					pk_id: this.dialog.pk_id,
				}, (res) => {
					this.dialog = null;
				}, 'http://45.125.45.234:5557');
			},
			confirmDialog() {
				this.$utils.request('/', {
					type: 'release_yes',
					uid: this.dialog.user_id,
					pk_id: this.dialog.pk_id,
				}, (res) => {
					this.dialog = null;
				}, 'http://45.125.45.234:5557');
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
					background: red;
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
