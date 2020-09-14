import {request} from "../utils/index.js"
export function toggle_focus_person(data) {
	return request({
		url: 'user/toggle_focus',
		method: 'post',
		data
	})
}
export function get_focus_list(data) {
	return request({
		url: 'focus/get_article',
		method: 'post',
		data
	})
}