<template>
	<view :style="{ height: statusBarHeight }" class="uni-status-bar">
		<slot />
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusBarHeight: statusBarHeight
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-status-bar {
		width: 750rpx;
		height: 20px;
		// height: var(--status-bar-height);
		position: relative;
		z-index: 999;
		background: #FFFFFF;
	}
</style>
