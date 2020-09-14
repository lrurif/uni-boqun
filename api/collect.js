import {request} from "../utils/index.js"
// 获取文章列表
export function getCollectArticle(data) {
    return request({
        url: 'collect/getCollectArticle',
        method: 'post',
        data
    })
}