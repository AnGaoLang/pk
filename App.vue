<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			
		}
	}
</script>

<style>
	page { font-size: 26rpx;}
	/*每个页面公共css */
	image {width: auto; height: auto;}
	.d-flex {display: flex; align-items: center;}  
	.d-flex-jsb {display: flex; justify-content: space-between; align-items: center;}
	.d-flex-center {display: flex; justify-content: center; align-items: center;}
	.fw-bold {font-weight: bold;}
	.fs-10 {font-size: 20rpx;}
	.fs-11 {font-size: 22rpx;}
	.fs-12 {font-size: 24rpx;}
	.fs-13 {font-size: 26rpx;}
	.fs-14 {font-size: 28rpx;}
	.fs-15 {font-size: 30rpx;}
	.fs-16 {font-size: 32rpx;}
	.fs-17 {font-size: 34rpx;}
	.fs-18 {font-size: 36rpx;}
	.fs-19 {font-size: 38rpx;}
	.fs-20 {font-size: 40rpx;}
	.container { padding: 0 44rpx;}
	.cover { position: fixed; width: 100%; height: 100%; background: rgba(0,0,0, 0.5); left: 0; top: 0;}
	.page-top { border-top: 19rpx solid #F4F6F8;}
	
	.pk {
		text-align: center;
		line-height: 114rpx;
		font-size: 36rpx;
		height: 114rpx;
		background: linear-gradient(180deg, #01DAA5, #03B97E);
		border-radius: 57px;
		color: #FFFFFF;
		margin-top: 114rpx;
	}
	
	.no-more {
		text-align: center;
		padding: 20rpx 0;
		color: #949492;
		font-size: 24rpx;
	}
	
	.rich-txt{
		word-break: break-all;
		white-space: pre-warp;
	}
</style>
