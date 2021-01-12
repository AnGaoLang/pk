<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infos:''
			};
		},
		onLoad(option) {
			this.getInfo(option.id);
		},
		methods:{
			getInfo(id){
				let that = this;
				this.$utils.postrequest('/api/repost', {
					user_id:id
				}, function(res) {
					if (res.code == 200) {
						that.infos = res.data;
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
			send(){
				let that = this;
				this.$utils.postrequest('/api/repost/add', {
					bei_report_user_id:'',//举报用户id int
					report_why_id:'',//举报原因id int
					image_prove:'',//图片证据 string
					describe:'',//投诉内容 string
				}, function(res) {
					if (res.code == 200) {
						that.$utils.showLayer('举报成功');
					} else {
						that.$utils.showLayer(res.message);
					}
				});
			},
		}
	}
</script>

<style lang="scss">

</style>
