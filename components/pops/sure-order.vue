<template>
	<view>
		<view class="z-mask"></view>
		<view class="content">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.z-mask{
	width: 100%;
	height: 100vh;
	background: rgba(0,0,0,.5);
	position: fixed;
	top: 0;
	left: 0;
}
.content{
	width: 492rpx;
	height: 826rpx;
	border: 16rpx solid;
	border-image: linear-gradient(131deg, #01DAA5, #03B97E) 16 16;
	border-radius: 30rpx;
}
</style>
