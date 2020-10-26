import {request} from "./request";

export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}

//把详情页里的商品信息整合并封装成一个类方便组件使用
export class Goods {
  constructor(itemInof, columns, services) {
    this.title = itemInof.title
    this.desc = itemInof.desc
    this.newPrice = itemInof.lowNowPrice
    this.oldPrice = itemInof.oldPrice
    this.discount = itemInof.discount
    this.columns = columns
    this.services = services
    this.realPrice = itemInof.lowNowPrice
  }
}

//将获取的店铺信息封装成一个类
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo
    this.name = shopInfo.name
    this.fans = shopInfo.cFans
    this.sells = shopInfo.cSells
    this.score = shopInfo.score
    this.goodsCount = shopInfo.cGoods
  }
}
//将获取的商品详情页中的参数的信息封装成一个类
export class GoodsParam {
  constructor(info, rule) {
    //注：images可能没有值（某些商品有值，某些商品没有值）
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables
  }
}

export function getRecommend() {
  return request({
    url: '/recommend'
  })
}
