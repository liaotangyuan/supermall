<template>
  <div id="detail">
    <detail-nav-bar class="nav-bar"
                    ref="nav"
                    @titleClick="titleClick"/>
    <scroll class="scroll"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="Goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll"
import GoodsList from "components/content/goods/GoodsList";

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail"
import {itemListenerMixin,backTopMixin} from "common/mixin"
import {debounce} from "../../common/utils";
import BackTop from "../../components/content/backTop/BackTop";


export default {
  name: "Detail",
  mixins: [itemListenerMixin,backTopMixin],
  data() {
  return {
    iid: null,
    topImages: [],
    Goods: {},
    shop: {},
    detailInfo: {},
    paramInfo: {},
    commentInfo: {},
    recommends: [],
    themoTopYs: [],
    getThemoTopY: null,
    currentIndex: 0
  }
  },
  components: {
    BackTop,
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList

  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid
    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部轮播图的数据
      const data = res.data.result;
      // console.log(res); //打印res，方便查看内部数据结构
      this.topImages = data.itemInfo.topImages
      // 2.获取商品数据,将杂乱的数据整合到Goods类中
      this.Goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services)
      // console.log(data);

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      // console.log(data.shopInfo.score);

      // 4.获取商品的详细数据=上身效果部分
      this.detailInfo = data.detailInfo;

      // 5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,
        data.itemParams.rule)

      // 6.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      /*
      // $nextTick函数会在页面渲染出来后回调，所以获取页面元素高度应该渲染后执行
      // 根据最新的数据，对应的DOM是已经渲染出来了，但是图片是依然没有加载完成的，
      // 所以获取到的offsetTop不包含其中的图片，一般offsetTop值不对的时候基本
      // 都是因为图片的影响，因为图片会后渲染，所以代码放在此处仍然不对！！！
      this.$nextTick(() => {
        //获取详情页中[商品，参数，评论，推荐]模块对应的offsetTop
        this.themoTopYs = []
        this.themoTopYs.push(0)
        this.themoTopYs.push(this.$refs.params.$el.offsetTop)
        this.themoTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themoTopYs.push(this.$refs.recommend.$el.offsetTop)
      })
       */

    })
    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.data.list
    })
    // 4.给getThemoTopY赋值（对给this.getThemoTopYs赋值的操作进行防抖）
    this.getThemoTopY = debounce(() => {
      //获取详情页中[商品，参数，评论，推荐]模块对应的offsetTop
      this.themoTopYs = []
      this.themoTopYs.push(0)
      this.themoTopYs.push(this.$refs.params.$el.offsetTop -44)
      this.themoTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themoTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
      this.themoTopYs.push(Number.MAX_VALUE)
    },100)

  },
  mounted() {
    //注意：这里面不是没有内容而是内容因为要代码复用所以放到了混入工具mixin中

  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    imageLoad() { //接收到DetailGoodsInfo里的图片刷新函数再刷新一次scroll的高度
      // 使用mixin里的防抖函数加工一下，使得对this.$refs.scroll.refresh()
      // 函数的调用不再那么频繁,增加性能
      // this.nreRefresh
      this.$refs.scroll.refresh()

      //等图片加载完成后获取各模块在页面中的offsetTop才是最正确的
      this.getThemoTopY() //将原函数调用防抖函数后回调此函数


    },
    //获取到用户点击的title的index再将页面滚动条位置调整到该模块的滚动条位置
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themoTopYs[index],300)

    },
    contentScroll(position) {
      // 1.获取Y值
      const positionY = -position.y
      // 2.将滚动的positionY和title中的值进行对比
      let length = this.themoTopYs.length
      // 用if比较滚动的值和title中的值
      for (let i = 0; i < length-1; i++) {
        //用这个做法我们需要再向themoTopYs数组中push一个值，这个值这里用了js中Number所能
        //表示的最大值Number.MAX_VALUE，然后if判断就能好写得多了，这样也能提升执行效能的
        if (this.currentIndex != i && //currentIndex的值=i时是位于同一模块中的
          (positionY >= this.themoTopYs[i] && positionY < this.themoTopYs[i+1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
        //用这个if做法就是纯条件判断，不需要往数组中添加新的值，但是最后一个块的判断会更复杂
        //些，这样代码的执行效能会降低，这里就是常规if判断的做法
        // if (this.currentIndex != i &&
        //   (i < length - 1 && positionY >= this.themoTopYs[i]
        //     && positionY < this.themoTopYs[i+1]) ||
        //   (i === length - 1 && positionY >= this.themoTopYs[i])) {
        //   this.currentIndex = i
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }
      // 判断BackTop按钮是否显示(listenShowBackTop在混入工具mixin中)
      this.listenShowBackTop(position)
    },
    // 加入购物车的事件处理
    addToCart () {
      // 1.获取购物车需要展示的数据
      const product = {}
      product.image = this.topImages[0]
      product.title = this.Goods.title
      product.desc = this.Goods.desc
      product.price = this.Goods.newPrice
      product.iid = this.iid
      product.realPrice = this.Goods.realPrice
      //将商品添加到购物车中（方法1.dispatch会返回一个Promise所以可以用.then()接收；
      // 方法2.mapActions，将vuex中的actionsimport映射过来就可以直接使用里面的
      // addCart函数了，一样是使用.then()接收即可）
      this.$store.dispatch('addCart',product).then(res => {
        //使用封装的toast弹窗组件显示提示信息
        this.$toast.show(res, 2500)
      })
    }
  },

}
</script>

<style scoped>
 #detail {
   position: relative;
   z-index: 9;
   background-color: #fff;
   height: 100vh;
   overflow: hidden;
 }
 .nav-bar {
   position: relative;
   z-index: 9;
   background-color: #fff;
 }

 .scroll {
   height: calc(100% - 44px - 49px);
   overflow: hidden;
 }

</style>
