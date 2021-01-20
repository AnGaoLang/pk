import Vue from 'vue'
import App from './App'
import utils from './utils/util'
import url from './common/config.js'
import socketIo from './common/socket.js'


import uniFooters from "@/components/uni-footers.vue"
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import uniStatusBar from "@/components/uni-status-bar/uni-status-bar.vue"

Vue.config.productionTip = false

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
