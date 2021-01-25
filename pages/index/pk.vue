<template>
	<view class="border-top">
		<uni-status-bar></uni-status-bar>
		<uni-nav-bar left-icon="back" title="PK详情" @clickLeft="back" @clickRight="jubao">
		    <view slot="right">
				<image src="/static/jb.png" mode="widthFix" class="right-icon"></image>
			</view>
		</uni-nav-bar>
		<view class="user-info order-item d-flex">
			<view class="order-l"><image :src="tuijianData.avatar" mode="widthFix"></image></view>
			<view class="order-r d-flex-jsb">
				<view class="order-info">
					<view class="order-name">游戏名称：{{ tuijianData.pk_name }}<view class="greenBg" @tap="copy(tuijianData.pk_name)">一键复制</view></view>
					<view class="order-label d-flex">
						<view>{{ tuijianData.pk_format }}</view>
						<view>{{ tuijianData.type_name }}</view>
					</view>
				</view>
				<view class="order-price d-flex">
					<view class="pk-icon"><image src="../../static/pk.png" mode="widthFix"></image></view>
					<view class="get-s d-flex">
						<image src="../../static/jia.png" mode="widthFix"></image>
						<text>{{ tuijianData.pk_price }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-data">
			<view class="order-title">游戏主页</view>
			<view class="order-pic"><image :src="tuijianData.game_home_image" mode="widthFix"></image></view>
			<div class="d-flex-jsb">
				<view class="talk-icon d-flex">
					<image src="../../static/liaotian.png" mode="widthFix"></image>
					<text>聊天</text>
				</view>
				<view class="pub-time">发布时间:{{ tuijianData.created_at }}</view>
			</div>
			<view class="note-info">注意事项</view>
			<view class="note-text">
				<rich-text :nodes="pk_explain" class="rich-txt"></rich-text>
				<!-- <view class="note-f">1.请到王者→设置→隐私设置→战绩显示→打开</view>
				<view>2.如发现游戏主页面与游戏ID不符请放弃该PK</view>
				<view>3.请勿脱离平台交易</view>
				<view>4.可以选择双方确定开始PK后在进入游戏，客服会根据实际的比赛记录判定，如果无属实记录会自动退回余额</view> -->
			</view>
			<view class="pk" @click="showLoadingDialog">点击PK</view>
		</view>
		<view v-show="showLoading" class="cover">
			<view class="content">
				<view class="title">{{showLoadText || '等待确认中'}}</view>
				<view class="dialog-info">
					{{showLoadContent || '正在等待对手玩家确认开始 请稍后.'}}
				</view>
				<view v-if="!showLoadText" class="loading">
					<view :class="{ active: time > 0 }"></view>
					<view :class="{ active: time > 1 }"></view>
					<view :class="{ active: time > 2 }"></view>
					<view :class="{ active: time > 3 }"></view>
					<view :class="{ active: time > 4 }"></view>
					<view :class="{ active: time > 5 }"></view>
				</view>
				<view v-else style="margin: auto;width: 44rpx;height:44rpx;" @tap="showLoading = false">
					<image style="width: 100%;height:100%;" src="../../static/cuowublack.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
let timer = null;
export default {
	data() {
		return {
			showLoading: false,
			showLoadText: '',
			showLoadContent: '',
			time: 0,
			tuijianData: {},
			pk_explain: ''
		};
	},
	onLoad(option) {
		if (option.id) {
			this.getTuijianDetails(option.id);
		};
		let uid = JSON.parse(uni.getStorageSync('userInfo')).id;
		if (this.$socketIo.disconnected) {
			this.$socketIo.connect();
			this.$socketIo.on('connect', () => {
				console.log(123123213)
			  this.$socketIo.emit('login', uid)
			});
		} else {
			this.$socketIo.emit('login', uid)
		}
		this.$socketIo.on('new_msg', (msg) => {
			console.log('msgpk', msg)
			let message = msg && JSON.parse(msg);
			if (message && message.data == 1) {
				this.showLoadText = "对方确认";
				this.showLoadContent = '对方确认接受你的PK 快去王者一决高下';
				setTimeout(() => {
					this.showLoading = false;
					this.showLoadText = "";
					this.showLoadContent = '';
				}, 3000)
				console.log('同意')
			}
			if (message && message.data == 0) {
				this.showLoadText = "对方拒绝";
				this.showLoadContent = '对方拒绝接受你的PK 去看看其他用户发布的挑战吧';
				setTimeout(() => {
					this.showLoading = false;
					this.showLoadText = "";
					this.showLoadContent = '';
				}, 3000)
				console.log('不同意')
			}
		});
	},
	onShow() {
		if (this.showLoading) {
			setTimeout(() => {
				this.showLoading = false;
				this.showLoadText = "";
				this.showLoadContent = '';
				this.$socketIo.disconnect();
			}, 1000 * 120)
		}
	},
	methods: {
		copy(data) {
			uni.setClipboardData({
				data: data
			});
		},
		// 返回
		back(){
			uni.navigateBack();
		},
		// 举报
		jubao(){
			uni.navigateTo({
				url:'/pages/user/jubao?id='+this.tuijianData.user_id
			})
		},
		showLoadingDialog() {
			uni.navigateTo({
				url:'/pages/order/pub2?id='+this.tuijianData.id
			})
			// this.showLoading = true;
			// timer = setInterval(d => {
			// 	if (this.time < 6) {
			// 		this.time++;
			// 	} else {
			// 		this.time = 0;
			// 	}
			// }, 1000);
		},
		getTuijianDetails(id) {
			let that = this;
			this.$utils.request('/api/pk/detail?id=' + id, {}, function(res) {
				console.log(res);
				if (res.code == 200) {
					that.tuijianData = res.data.detail;
					that.pk_explain = res.data.pk_explain;
				} else {
					that.$utils.showLayer(res.message);
				}
			});
		}
	}
};
</script>

<style lang="less">
	.right-icon{
		width: 24rpx;
	}
.border-top {
	// border-top: 20rpx #f4f6f8 solid;
	overflow: hidden;
}

.order-item {
	border-bottom: 1px solid #ece9e9;
	padding: 26rpx 28rpx;

	.order-l {
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
		background: #eee;
		margin-right: 20rpx;
		overflow: hidden;
		image {
			width: 100%;
		}
	}

	.order-r {
		width: calc(100% - 124rpx);

		.order-name {
			color: #2b2937;
			font-size: 28rpx;
			font-weight: bold;
			.greenBg {
				display: inline-block;
				margin-left: 10rpx;
				font-size: 20rpx;
				padding: 2rpx 10rpx;
				color: #fff;
				font-weight: normal;
				border-radius: 6rpx;
				background: linear-gradient(#01DAA5, #03B97E);
			}
		}

		.order-label {
			margin-top: 16rpx;

			view {
				height: 33rpx;
				line-height: 33rpx;
				color: #fff;
				font-size: 16rpx;
				padding: 0 20rpx;
				margin-right: 13rpx;
			}

			& > view:nth-child(1) {
				background: linear-gradient(165deg, #ffa008, #ff8305);
				border-radius: 17px;
			}

			& > view:nth-child(2) {
				background: linear-gradient(165deg, #01daa5, #03b97e);
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
			color: #ff9507;
			font-weight: 800;
			font-size: 45rpx;

			image {
				width: 16rpx;
			}
		}
	}
}

.order-data {
	padding: 0 30rpx;

	.order-title {
		height: 88rpx;
		line-height: 88rpx;
	}

	.order-pic {
		min-height: 330rpx;
		// background: #eee;
		image{
			width: 100%;
		}
	}

	.talk-icon {
		padding: 20rpx 0;
		color: #a9a8ab;
		font-size: 24rpx;

		image {
			margin-right: 10rpx;
			width: 36rpx;
		}
	}

	.pub-time {
		color: #a9a8ab;
		font-size: 24rpx;
	}
}

.note-info {
	font-size: 30rpx;
	color: #333333;
}

.note-text {
	font-size: 24rpx;
	view {
		margin-top: 18rpx;
	}
}

.pk {
	text-align: center;
	line-height: 114rpx;
	font-size: 36rpx;
	height: 114rpx;
	background: linear-gradient(180deg, #01daa5, #03b97e);
	border-radius: 57px;
	color: #ffffff;
	margin-top: 53rpx;
}

.note-f {
	color: #fd3708;
}

.content {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 541rpx;
	height: 300rpx;
	background: #ffffff;
	border-radius: 20rpx;
	text-align: center;

	.title {
		margin-top: 50rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.dialog-info {
		width: 360rpx;
		margin: 25rpx auto;
		font-size: 30rpx;
	}

	.loading {
		display: flex;
		justify-content: center;
		margin-top: 33rpx;
		view {
			width: 12rpx;
			height: 12rpx;
			background: #1d1d1d;
			border-radius: 18rpx;
			margin: 0 10rpx;

			&.active {
				background: rgb(2, 200, 144);
			}
		}
	}
}
</style>
