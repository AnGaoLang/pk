// const domain = 'http://vr.hualin688.com/'
// const domain = '/api'
import urlConfig from '@/common/config.js'
const formatTime = date => {
	const year = new Date(date).getFullYear()
	const month = new Date(date).getMonth() + 1
	const day = new Date(date).getDate()
	const hour = new Date(date).getHours()
	const minute = new Date(date).getMinutes()
	const second = new Date(date).getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
function formatRichText(html) {
	let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
		match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
		match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
		match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
		return match;
	});
	newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
		match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
		return match;
	});
	newContent = newContent.replace(/<br[^>]*\/>/gi, '');
	newContent = newContent.replace(/\<img/gi,
		'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
	return newContent;
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function showLayer(con, icon) {
	uni.showToast({
		icon: icon || 'none',
		title: con,
		// duration:10000
	});
}

function postrequest(url, data, callback) {
	var jsonData = JSON.stringify(data);
	var token = wx.getStorageSync('token');

	wx.request({
		// url: 'http://49.234.23.223:80/rest/' + url,
		url: urlConfig.url_config + url,
		method: "POST",
		data: data,
		header: {
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + token
		},
		success: function(obj) {

			wx.stopPullDownRefresh()
			if (obj.data.code == 301) {
				uni.showToast({
					title: '请重新登录',
					icon: 'none'
				})
				setTimeout(function() {
					uni.reLaunch({
						url: '/pages/user/login'
					})
				}, 800)
			} else {
				var data = obj.data;
				callback(data)
			}
		}

	})
}

function request(url, data, callback, basurl) {
	var jsonData = json2Form(data);
	var token = wx.getStorageSync('token');
	wx.request({
		url: (basurl || urlConfig.url_config) + url,
		// url: 'http://49.234.23.223:80/rest/' + url,
		method: "GET",
		data: data,
		"Authorization": 'Bearer ' + token,
		header: {
			"Content-Type": 'application / json',
			"Authorization": 'Bearer ' + token
			// "Content-Type": "application/x-www-form-urlencoded"
		},
		success: function(obj) {
			// debugger
			console.log('jinlaile', obj.data.code == 301)
			wx.stopPullDownRefresh()
			if (obj.data.code == 301) {
				uni.showToast({
					title: '请重新登录',
					icon: 'none'
				})
				setTimeout(function() {
					uni.reLaunch({
						url: 'pages/user/login'
					})
				}, 800)

			} else {
				var data = obj.data;
				callback(obj.data)
			}

		}

	})
}

function json2Form(json) {
	var str = [];
	for (var p in json) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
	}
	return str.join("&");
}


export default {
	showLayer: showLayer,
	domain: urlConfig.url_config,
	formatTime: formatTime,
	json2Form: json2Form,
	formatRichText: formatRichText,
	request(url, data, callback, basurl) {
		return request(url, data, callback, basurl)
	},
	postrequest(url, data, callback) {
		return postrequest(url, data, callback)
	}
}
