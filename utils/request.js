export default let axios = (config, basurl="http://vr.hualin688.com/") => {
	return new Promise((res, reg) => {
		uni.request({
			url: basurl + config.url,
			data: config.data,
			method: config.method || 'get',
			success: _ => {
				res(_.data)
			},
			fail: _ => {
				reg(_)
			}
		})
	})
}