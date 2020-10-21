import {request} from "./request";

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

//获取首页商品流行/新款/精选的具体数据
export function getHomeGoods(type,page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}
