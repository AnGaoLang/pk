<template>
	<view>
		<view class="order-list">
			<view class="order-item d-flex-jsb" v-for="(d, i) in list" :key="i" @click="toDetail">
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
				page: 1,
				isData: true,
				list: [],
			};
		},
		
		onLoad() {
			this.list =[]
			this.release();
		},
		
		methods:{
			release() {
				this.$utils.postrequest('/api/my/release', {page: this.page}, res => {
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
				this.release()
			}
		}
	}
</script>

<style lang="less">
@import '../../styles/order.less';
page {
	background: #F4F6F8;
}
</style>
