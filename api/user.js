import {request} from "../utils/index.js"
export function wxLogin(data) {
	return request({
		url: 'user/wxLogin',
		method: 'post',
		data
	})
}
// 请求用户信息
export function getUserInfoById(data) {
	return request({
		url: 'user/getUserInfoById',
		method: 'post',
		data
	})
}
// 搜索用户
export function getUserBySearch(data) {
	return request({
		url: 'user/getUserBySearch',
		method: 'post',
		data
	})
}