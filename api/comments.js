import {request} from "../utils/index.js"
// 获取文章评论列表
export function getComments(data) {
    return request({
        url: 'comment/getAllComments',
        method: 'post',
        data
    })
}
// 新增评论
export function addComment(data) {
	return request({
	    url: 'comment/add',
	    method: 'post',
	    data
	})
}
// 评论点赞切换
export function toggleThumbUp(data) {
	return request({
	    url: 'comment/toggleThumbUp',
	    method: 'post',
	    data
	})
}