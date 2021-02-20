<template>
	<view class="page-top">
		<view class="info-list">
			<view class="info-item d-flex-jsb">
				<view class="info-tag">游戏名称</view>
				<view class="info-r d-flex">
					<input type="text" v-model="submit.pk_name" placeholder="王者荣耀的游戏名称">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="info-item d-flex-jsb">
				<view class="info-tag">PK金额</view>
				<view class="info-r d-flex">
					<input type="text" :disabled="true" :value="pk_info.pk_price">
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="info-item d-flex-jsb">
				<view class="info-tag">游戏段位</view>
				<picker mode="selector" :range="list" @change="setId">
					<view class="info-r d-flex">
						<input type="text" disabled v-model="currentName" placeholder="选择王者荣耀当前段位">
						<image src="../../static/you.png" mode="widthFix"></image>
					</view>
				</picker>
			</view>
			<view class="info-item d-flex-jsb">
				<view class="info-tag">比赛赛制</view>
				<view class="info-r d-flex">
					<view class="pk-type d-flex">
						<!-- <view class="d-flex" @click="setFormat(i+1)" v-for="(t,i) in pk_format" :key="i">
							<text>{{t}}</text>
							<image v-if="submit.pk_format_id !== i+1" src="../../static/check.png" mode="widthFix"></image>
							<image v-if="submit.pk_format_id === i+1" src="../../static/checked.png" mode="widthFix"></image>
						</view> -->
						<view class="d-flex">
							<text>{{pk_info.pk_format_value}}</text>
							<!-- <image v-if="submit.pk_format_id !== 2" src="../../static/check.png" mode="widthFix"></image> -->
							<image src="../../static/checked.png" mode="widthFix"></image>
						</view>
					</view>
					<image src="../../static/you.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="game-info">
				<view class="game-title">游戏主页截图</view>
				<view class="game-pic d-flex">
					<view class="pic-container">
						<image src="/static/anc.jpg" mode="heightFix" v-if="submit.game_home_image == ''"></image>
						<image :src="submit.game_home_image" mode="heightFix" v-else></image>
					</view>
					<view class="upload-btn">
						<image src="../../static/upload.png" mode="widthFix" style="width: 200rpx;" @click="uploadImg"></image>
					</view>
				</view>

				<view class="note-info">注意事项</view>
				<view class="note-text">
					<rich-text :nodes="pk_explain" class="rich-txt"></rich-text>
					<!-- <view class="note-f">1.请到王者→设置→隐私设置→战绩显示→打开</view>
					<view>2.如发现游戏主页面与游戏ID不符请放弃该PK</view>
					<view>3.请勿脱离平台交易</view>
					<view>4.可以选择双方确定开始PK后在进入游戏，客服会根据实际的比赛记录判定，如果无属实记录会自动退回余额</view> -->
				</view>
				<view class="pk" @click="showLoadingDialog">确认提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	import socketIo from '../../common/socket.js';
	export default {
		data() {
			return {
				// pk_id:'',//接单pkid
				submit: {
					pk_id:"",
					pk_name: "",
					// pk_price: "",
					type_id: "",
					// pk_format_id: "",
					game_home_image: "",
					// game_home_image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202007%2F01%2F20200701063944_5VaBk.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611773272&t=a8c5aa0bee48ced648a38b6cf78d4902",
				},
				currentName: "",
				list: [],
				base: [],
				pk_explain:'',//注意事项
				pk_format:'',//比赛赛制
				pk_info:''
			};
		},
		onLoad(option) {
			this.getTuijian(option.id);
			this.submit.pk_id = option.id;
		},

		methods: {
			// 上传图片
			uploadImg(){
				var that = this
				uni.chooseImage({ //选中本地图片
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: res => {
						uni.showLoading({ //加载框
							title: '加载中...'
						})
						// console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						console.log(tempFilePaths[0]);
							uni.uploadFile({
								// url: 'http://vr.hualin688.com/api/upload', //上传接口地址
								url: that.$url.url_config+'api/upload', //上传接口地址
								filePath: tempFilePaths[0],
								name: 'file',
								header:{
									"Authorization": 'Bearer ' + wx.getStorageSync('token')
								},
								success: (res) => {
									let data = JSON.parse(res.data);
									console.log(data);
									uni.hideLoading();
									if(data.code==200){
										that.submit.game_home_image = data.data;
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
									console.log(err);
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
			// 获取pk选取信息
			getTuijian(id) {
				let that = this;
					console.log(id);
				this.$utils.request('/api/pk_user_order_information/index', {pk_id:id}, res => {
					console.log(res);
					if (res.code == 200) {
						that.pk_explain = res.data.pk_explain;
						that.pk_info = res.data.info;
						that.list = res.data.type.map(d => d.type_name);
						this.base = res.data.type;
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},

			setFormat(val) {
				this.submit.pk_format_id = val;
			},

			setId(ev) {
				this.submit.type_id = this.base[ev.detail.value].id;
				this.currentName = this.base[ev.detail.value].type_name;
			},

			showLoadingDialog() {
				let that = this;
				this.$utils.postrequest('/api/pk_user_order_information/add', this.submit, res => {
					console.log(res);
					if (res.code === 200) {
						let receivingOrder = {
							type: 'receiving_order',
							uid: JSON.parse(uni.getStorageSync('userInfo')).id,
							pk_id: this.submit.pk_id,
						};
						this.$utils.request('/', receivingOrder, (res) => {
							if (res.code == 200) {
								var pages=getCurrentPages(), prevPage=null;
								if(pages.length>1){
									prevPage=pages[pages.length-2];
								}
								if(prevPage){
									// #ifdef APP-PLUS || H5
										prevPage.$vm.showLoading=true;
									// #endif
									// #ifdef MP-WEIXIN
										prevPage.setData({
											showLoading : true
										})
									// #endif
								}
								uni.navigateBack();
							} else {
								this.$utils.showLayer(res.message);
							}
						}, 'http://45.125.45.234:5557');
					} else {
						that.$utils.showLayer(res.message);
					}
				})
				// uni.showModal({
				// 	title: '提示',
				// 	content: "确认发布PK吗?",
				// 	success: res => {
				// 		if (res.confirm) {
				// 			this.$utils.postrequest('/api/pk/add', this.submit, res => {
				// 				// this.$utils.showLayer(res.message);
				// 				if (res.code === 200) {
				// 					uni.reLaunch({
				// 						url: '../index/index'
				// 					})
				// 				} else {
				// 					that.$utils.showLayer(res.message);
				// 				}
				// 			})
				// 		}
				// 	}
				// })
			},
		}
	}
</script>

<style lang="less">
	.info-list {
		padding: 0 37rpx;

		.info-item {
			height: 108rpx;
			border-bottom: 1px solid #E9E9E9;

			input {
				font-size: 30rpx;
				text-align: right;
			}

			.info-r>image {
				width: 15rpx;
				margin-left: 26rpx;
			}

			.pk-type {
				view {
					margin-left: 66rpx;
					height: 108rpx;
					line-height: 108rpx;
				}

				image {
					width: 34rpx;
				}
			}
		}
	}

	.game-title {
		height: 108rpx;
		line-height: 108rpx;
	}

	.pic-container {
		min-width: 200rpx;
		height: 200rpx;
		background: #eee;
		margin-right: 30rpx;
		image {
			height: 200rpx;
		}
	}


	.note-info {
		margin-top: 30rpx;
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
		background: linear-gradient(180deg, #01DAA5, #03B97E);
		border-radius: 57px;
		color: #FFFFFF;
		margin-top: 53rpx;
	}

	.note-f {
		color: #FD3708;
	}
</style>
