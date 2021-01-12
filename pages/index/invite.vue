<template>
	<view>
		<view class="user-container">
			<view class="user-face">
				<image :src="shareInfo.avatar"></image>
			</view>
			<view class="user-name">{{shareInfo.name}}</view>
			<view class="invite-desc">邀请你下载加入PKAPP</view>
			<view class="invite-ma">
				<image :src="shareInfo.qrcode"></image>
			</view>
			<view class="invite-code">邀请码:{{shareInfo.user_code}}</view>
			<view class="save" @click="share(shareInfo.qrcode)">保存分享</view>
		</view>
		<uni-footers :pag='4'></uni-footers>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shareInfo:{},//分享信息
			};
		},
		onShow() {
			this.getShareInfo();
		},
		methods:{
			// 保存分享
			share(url){
				// 保存图片
				// uni.getImageInfo({  
				// 	src: url,  
				// 	success: function(image) {  
				// 		console.log('图片信息：', JSON.stringify(image));  
				// 		uni.saveImageToPhotosAlbum({  
				// 			filePath: image.path,  
				// 			success: function() {
				// 				console.log('save success');  
				// 				uni.showToast({  
				// 					title: '图片保存成功',  
				// 					icon: 'none',  
				// 					duration: 2200  
				// 				});
								
				// 			}  
				// 		});  
				// 	}  
				// });
				// 分享图片
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 2,
				    imageUrl: url,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			},
			// 获取分享信息
			getShareInfo(){
				let that =this;
				this.$utils.postrequest('api/share', {}, res => {
					console.log(res);
					if (res.code == 200) {
						console.log(res);
						that.shareInfo = res.data;
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
	background: #03BA80;
	
	.user-container {
		margin: 30rpx 55rpx;
		padding-bottom: 100rpx;
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		text-align: center;
		.user-face {
			margin: 73rpx auto 34rpx;
			// background: #eee;
			border-radius: 50%;
			overflow: hidden;
			width: 110rpx;
			height: 110rpx;
			border: 6rpx solid #fff;
			box-shadow: 0 12rpx -6rpx rgba(0, 0, 0, 0.1);
			image{
				width: 100%;
				height: 100%;
			}
		}
		
		.user-name {
			font-size: 32rpx;
		}
		
		.invite-desc {
			color: #86898D;
			font-size: 26rpx;
		}
		
		.invite-ma {
			width: 410rpx;
			height: 410rpx;
			// background: #eee;
			margin: 82rpx auto 0;
			image{
				width: 100%;
				height: 100%;
			}
		}
		
		.invite-code {
			margin: 25rpx 0;
			color: #03BA80;
		}
		
		.save {
			width: 244rpx;
			height: 96rpx;
			text-align: center;
			margin: auto;
			line-height: 96rpx;
			border: 3px dashed #03BA80;
			border-radius: 10px;
			font-size: 36rpx;
			color: #03BA80;
			font-weight: bold;
		}
	}
}
</style>
