<template>
	<view class="page-top">
		<view class="container">
			<view class="jubao-head d-flex">
				<view>举报用户</view>
				<view class="d-flex">
					<view class="head-image">
						<image mode="widthFix" :src="headsrc"></image>
					</view>
					<text>{{name}}</text>
				</view>
			</view>
			<view class="jubao-content item">
				<view>举报原因</view>
				<view class="reason">
					<view :class="{'select': item.select}" 
						v-for="(item, index) in list"
						:key="index"
						@tap="select(item)">{{item.report}}</view>
				</view>
			</view>
			<view class="jubao-image item">
				<view>图片证据</view>
				<view class="image-container" @tap="uploadImg">
					<image src="/static/upload.png" mode="heightFix" v-if="image == ''"></image>
					<image :src="image" mode="heightFix" v-else></image>
				</view>
			</view>
			<view class="jubao-complain item">
				<view>投诉内容</view>
				<textarea class="complain-detail" v-model="complain" placeholder="请填写详细的举报理由" maxlength="200"></textarea>
				<view class="tips">{{complain.length}}/200</view>
			</view>
			<view class="jubao-btn" @tap="submit">确认提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: '',
				headsrc: '',
				name: '',
				list: [],
				image: '',
				complain: '',
			};
		},
		onLoad() {
			this.userId = JSON.parse(uni.getStorageSync('userInfo')).id;
			this.getGuBaoDetail(this.userId)
		},
		methods: {
			getGuBaoDetail(uid) {
				this.$utils.postrequest('/api/repost', {user_id: uid}, res => {
					if (res.code === 200) {
						this.headsrc = res.data.user.avatar;
						this.name = res.data.user.name;
						this.list = res.data.report_type.map(item => ({
							id: item.id,
							report: item.report,
							select: false
						}));
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
			select(object) {
				this.list.forEach(item => {
					item.select = false
				})
				object.select = true;
			},
			submit() {
				let that = this;
				let report = this.list.find(item => item.select);
				this.$utils.postrequest('/api/repost/add', {
					bei_report_user_id: this.userId,
					report_why_id: report ? report.id : '',
					image_prove: this.image,
					describe: this.complain,
				}, res => {
					if (res.code === 200) {
						uni.navigateBack();
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
			uploadImg(){
				var that = this
				uni.chooseImage({ //选中本地图片
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: res => {
						uni.showLoading({
							title: '加载中...'
						})
						const tempFilePaths = res.tempFilePaths;
						console.log(tempFilePaths[0]);
							uni.uploadFile({
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
										that.image = data.data;
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
		}
	}
</script>

<style lang="less" scoped>
	.container {
		padding: 26rpx 30rpx;
		padding-right: 0;
		font-size: 32rpx;
		.jubao-head,.jubao-image,.jubao-complain {
			margin-bottom: 40rpx;
			padding-right: 30rpx;
		}
	}
	.jubao-head {
		height: 64rpx;
		line-height: 64rpx;
		.head-image {
			margin: 0 16rpx;
			width: 64rpx;
			height: 64rpx;
			border-radius: 100%;
			overflow: hidden;
			border: 1px solid #fafafa;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.jubao-content {
		margin-bottom: 40rpx;
		.reason {
			margin-top: 36rpx;
			display: flex;
			flex-wrap: wrap;
			view {
				margin: 0 20rpx 20rpx 0;
				padding: 30rpx 50rpx;
				background: #F6F7F9;
				border: 1px solid #E6E4EE;
				min-width: 200rpx;
				text-align: center;
				font-size: 26rpx;
				color: #191919;
				box-sizing: border-box;
				border-radius: 5rpx;
			}
			.select {
				background: linear-gradient(#01DAA5, #03B97E);
				color: #fff;
				border: 1px solid transparent;
			}
		}
	}
	.jubao-image {
		.image-container {
			margin-top: 36rpx;
			width: 200rpx;
			height: 200rpx;
			border: 1px dashed #E6E4EE;
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
	}
	.jubao-complain {
		position: relative;
		.complain-detail {
			display: block;
			width: auto;
			margin-top: 36rpx;
			padding: 25rpx 20rpx;
			background: #F6F7F9;
			border-radius: 1px solid #E6E4EE;
			border-radius: 10rpx;
		}
		.tips {
			position: absolute;
			right: 60rpx;
			bottom: 40rpx;
			color: #666B77;
		}
	}
	.jubao-btn {
		margin-top: 62rpx;
		width: 700rpx;
		height: 114rpx;
		line-height: 114rpx;
		text-align: center;
		color: #fff;
		border-radius: 114rpx;
		background: linear-gradient(#01DAA5, #03B97E);
	}
</style>
