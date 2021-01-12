<template>
	<view class="page-top">
		<view class="opt-list">
			<view class="opt-item d-flex-jsb" @click="upDate">
				<view>版本更新</view>
				<view class="">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="opt-item d-flex-jsb" @click="cleanCache">
				<view>清除缓存</view>
				<view class="d-flex">
					<!-- <text>125.5M</text> -->
					<text>{{all}}</text>
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="opt-item d-flex-jsb" @click="goXy(1)">
				<view>服务协议</view>
				<view class="">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="opt-item d-flex-jsb" @click="goXy(2)">
				<view>隐私政策</view>
				<view class="">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			
			<view class="pk" @click="loginOut">退出登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				all:''
			};
		},
		onLoad() {
			plus.cache.calculate(  ( size ) =>{ //size是多少个字节单位是b
			            //你可以做下面相应的处理
				 if(size<1024){
					 this.all=size+'B'; 
				 }  
				 else if(size/1024>=1 && size/1024/1024<1){
					  this.all= Math.floor(size/1024*100)/100+'KB';
				 }
				else if(size/1024/1024>=1){
						this.all=Math.floor(size/1024/1024*100)/100+'M';
				}
			});
		},
		methods:{
			// 版本更新
			upDate(){
				uni.showLoading();
				setTimeout(()=>{
					uni.hideLoading();
					this.$utils.showLayer('暂无更新');
				},1000)
			},
			// 清除缓存
			cleanCache(){
				// 使用plus.cache.calculate 获取应用的缓存大小，
				//可以询问用户是否删除
				let that = this;
				uni.showModal({
					title:'提示',
					content:'确定清除缓存吗?',
					success(res) {
					// 用户确定要删除
						if(res.confirm){
						//使用plus.cache.clear 清除应用中的缓存数据 这里清除后还要二十几KB没有清除，达不到全部清除
							plus.cache.clear( function () {
								uni.showToast({
									title:'清除成功',
									icon:'none',
									success() {
										//成功后处理
										that.all = '0B'
									}
								})
							});	
						}
					}
				})
				// uni.showLoading();
				// setTimeout(()=>{
				// 	uni.hideLoading();
				// 	this.$utils.showLayer('清除成功');
				// },1000)
			},
			// 跳转协议
			goXy(s){
				uni.navigateTo({
					url:'./agreement?type='+s
				})
			},
			// 退出登录
			loginOut(){
				uni.clearStorageSync();
				uni.reLaunch({
					url: '/pages/user/login'
				})
			}
		}
	}
</script>

<style lang="less">
.opt-list {
	padding: 0 30rpx;
	margin-top: 40rpx;
	.opt-item {
		height: 88rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		
		image {
			width: 17rpx;
			margin-left: 30rpx;
		}
	}
}

.pk {
	margin-top: 310rpx;
}
</style>
