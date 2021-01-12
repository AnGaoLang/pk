<template>
	<view>
		<rich-text :nodes="data"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:'',
				url:''
			};
		},
		onLoad(option) {
			if(option.type==1){
				uni.setNavigationBarTitle({
				　　title:'服务协议'
				})
				this.url = '/api/service_agreement';//服务协议
			}else{
				uni.setNavigationBarTitle({
				　　title:'隐私政策'
				})
				this.url = '/api/privacy_policy';//隐私政策
			}
			this.getXy();
		},
		methods:{
			getXy() {
				this.$utils.postrequest( this.url , {}, res => {
					if (res.code === 200) {
						this.data = res.data
					} else {
						that.$utils.showLayer(res.message);
					}
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
