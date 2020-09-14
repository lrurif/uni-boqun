import {request} from "../utils/index.js"
// 获取文章列表
export function getZhuanlan(data) {
    return request({
        url: 'zhuanlan/getRecommend',
        method: 'post',
        data
    })
}
// 获取专栏详情
export function getZhuanlanDetail(data) {
    return request({
        url: 'zhuanlan/getZhuanlanDetail',
        method: 'post',
        data
    })
}
// 关注或取消关注
export function focus(data) {
    return request({
        url: 'zhuanlan/focus',
        method: 'post',
        data
    })
}
// 专栏新增文章
export function addArticle(data) {
    return request({
        url: 'zhuanlan/addArticle',
        method: 'post',
        data
    })
}