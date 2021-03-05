<template>
	<view>
		<button type="default" @click="initScoket">连接socket</button>
		<button type="default" @click="loginScoket">登录socket</button>
	</view>
</template>

<script>
	import io from '../../common/socket-io.js';
	export default {
		data() {
			return {
				socket:''
			};
		},
		methods:{
			initScoket(){
				this.socket = io('http://139.155.33.218:5555', {
				  query: {},
				  transports: [ 'websocket', 'polling' ],
				  timeout: 5000,
				});
				console.log(this.socket)
				// 连接后登录
				this.socket.on('connect', () => {
					console.log(213123)
				  this.socket.emit('login');
				});
			},
			loginScoket(){
				// 连接后登录
				// this.socket.on('connect', function () {
				// 	console.log('lianjie')
				// });
				this.socket.emit('login', 100012);
			}
		}
	}
</script>

<style lang="scss">

</style>
