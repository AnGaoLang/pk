<template>
	<view class="page">
		<scroll-view scroll-y="true" class="list" @scrolltolower="lower">
			<view class="item" v-for="(t,i) in list">
				<view class="left">
					<view class="head-box">
						<image :src="t.avatar" class="head" mode="widthFix"></image>
					</view>
					<view class="info">
						<view class="name">{{t.name}}</view>
						<view class="num">ID:{{t.id}}</view>
					</view>
				</view>
				<view class="right">
					<text>聊天</text>
				</view>
			</view>
			<view class="no-more" v-if="!isData">~暂无更多~</view>
		</scroll-view>
		<input class="bind" v-model="invitCode" placeholder="填写邀请码绑定好友关系" @confirm="bindInput"  confirm-hold="true" type="text" confirm-type="done" placeholder-class="iptStyle"/>
		<!-- <view class="bind">填写邀请码绑定好友关系</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				isData: true,
				list:[],
				invitCode:''
			};
		},
		onLoad() {
			this.list =[]
			this.getFriends();
		},
		methods:{
			// 绑定邀请码
			bindInput(){
				this.$utils.postrequest('/api/my/invitationadduser', {user_code: this.invitCode}, res => {
					if (res.code === 200) {
						this.$utils.showLayer('绑定成功');
					} else {
						this.$utils.showLayer(res.message);
					}
				})
			},
			// 获取邀请列表
			getFriends() {
				this.$utils.postrequest('/api/my/invitationlist', {page: this.page}, res => {
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
			},
			// 触底加载下一页
			lower(){
				if (this.isData) {
					this.getFriends();
				}
			}
		}
	}
</script>

<style lang="scss">
	.page{
		position: relative;
		height: 100vh;
		box-sizing: border-box;
		padding-bottom: 300rpx;
		.line{
			position: absolute;
			width: 100%;
			height: 20rpx;
			left: 0;
			top: 0;
			background: #F4F6F8;
		}
		.list{
			height: 100%;
			.item{
				border-top: 1px solid #ECE9E9;;
				width: 100%;
				height: 170rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 32rpx;
				.left{
					display: flex;
					align-items: center;
					.head-box{
						width: 110rpx;
						height: 110rpx;
						border-radius: 50%;
						overflow: hidden;
						.head{
							width: 100%;
						}
					}
					.info{
						margin-left: 16rpx;
						.name{
							font-size: 28rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #2B2937;
							line-height: 44rpx;
						}
						.num{
							font-size: 22rpx;
							font-family: PingFang SC;
							color: #A9A8AB;
						}
					}
				}
				.right{
					width: 120rpx;
					height: 68rpx;
					background: linear-gradient(90deg, #01DAA5, #03B97E);
					border-radius: 34rpx;
					text-align: center;
					line-height: 68rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FFFFFF;
				}
			}
		}
		.bind{
			width: 690rpx;
			height: 108rpx;
			border: 3rpx solid #03BF85;
			border-radius: 54rpx;
			margin: auto;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 40rpx;
			font-family: PingFang SC;
			line-height: 108rpx;
			z-index: 2;
			text-align: center;
			color: #03C187;
			font-size: 36rpx;
		}
		.iptStyle{
			color: #03C187;
			font-size: 36rpx;
		}
	}
</style>
