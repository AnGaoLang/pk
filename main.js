import Vue from 'vue'
import App from './App'
import utils from './utils/util'
import url from './common/config.js'
import socketIo from './common/socket.js'

import tim from './commen/tim/tim.js'
import commen from './commen/commen.js'
import TIM from 'tim-js-sdk'
import store from './store/index.js'


import uniFooters from "@/components/uni-footers.vue"
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import uniStatusBar from "@/components/uni-status-bar/uni-status-bar.vue"

Vue.config.productionTip = false

Vue.prototype.tim = tim.tim  			//tim sdk 引入后生成的tim服务
Vue.prototype.$TIM = TIM				//tim 的状态/事件 常量
Vue.prototype.genTestUserSig = tim.genTestUserSig 
Vue.prototype.$store = store
Vue.prototype.$commen = commen

Vue.prototype.$utils = utils
Vue.prototype.$url = url
Vue.prototype.$socketIo = socketIo

Vue.component('uni-footers', uniFooters)
Vue.component('uni-nav-bar', uniNavBar)
Vue.component('uni-status-bar', uniStatusBar)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
