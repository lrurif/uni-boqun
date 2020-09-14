import {request} from "../utils/index.js"
// 获取文章列表
export function getArticle(data) {
    return request({
        url: 'article/getArticle',
        method: 'post',
        data
    })
}
// 获取文章内容
export function getArticleDetail(data) {
    return request({
        url: 'article/getArticleDetail',
        method: 'post',
        data
    })
}
// 发布文章
export function publishArticle(data) {
	return request({
		url: 'article/add',
		method: 'post',
		data
	})
}
// 新增阅读量
export function addReadNum(data) {
	return request({
		url: 'article/addReadNums',
		method: 'post',
		data
	})
}
// 新增浏览历史
export function addBrowsingHistory(data) {
	return request({
		url: 'article/addBrowsingHistory',
		method: 'post',
		data
	})
}
// 点赞功能
export function likeArticle(data) {
	return request({
		url: 'article/likeArticle',
		method: 'post',
		data
	})
}
// 收藏文章
export function addCollection(data) {
	return request({
		url: 'article/addCollection',
		method: 'post',
		data
	})
}
// 取消收藏文章
export function cancelCollection(data) {
	return request({
		url: 'article/cancelCollection',
		method: 'post',
		data
	})
}
// 获取浏览历史
export function getBrowsingArticle(data) {
	return request({
		url: 'article/getBrowsingArticle',
		method: 'post',
		data
	})
}
// 获取可投稿文章
export function getSubmitArticle(data) {
	return request({
		url: 'article/getSubmitArticle',
		method: 'post',
		data
	})
}
// 利用id获取文章数据
export function getArticleById(data) {
	return request({
		url: 'article/getArticleById',
		method: 'post',
		data
	})
}