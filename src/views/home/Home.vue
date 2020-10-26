<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick" ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";

import {getHomeMultidata,getHomeGoods} from "network/home";
import {itemListenerMixin,backTopMixin} from "common/mixin"


export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,

  },
  mixins: [itemListenerMixin,backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  computed: { //计算属性
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  activated() { //当用户进入此界面时将滚动条设置成上次保存的滚动条位置
    // 1.要先调用refresh刷新界面
    this.$refs.scroll.refresh()
    // 2.再调用scrollTo方法并赋值之前保存的saveY
    this.$refs.scroll.scrollTo(0, this.saveY,0)

  },
  deactivated() { //当用户离开此界面时保持当前界面的滚动条位置
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY);
    // 2.取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  created() { //创建生命周期函数使得界面一旦创建完成便发送网络请求获取数据
    //这里只需要调用，具体的实现交给methods去做
    //请求多个数据
    this.getHomeMultidata()
    //根据类别请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    //注意：这里面不是没有内容而是内容因为要代码复用所以放到了混入工具mixin中
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    //将首页中的两个tab-control标签的状态同步，实现内容与样式的统一
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    contentScroll(position) {
      // 1.判断BackTop按钮是否显示(listenShowBackTop在混入工具mixin中)
      this.listenShowBackTop(position)
      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    //获取tabControl的offsetTop
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res);
        // this.result = res //将获取到的数据保存下来方便使用
        this.banners = res.data.data.banner.list;
        this.recommends = res.data.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      //动态决定获取的数据的页码,每次获取的页码是当前页码+1,不要直接把页码写死
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then( res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.data.list)
        this.goods[type].page += 1
        //完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }

}
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;   /*子绝父相，方便给.content定位*/
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;
    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  /*.tab-control {  !*这个设置主要用于实现此组件的吸顶效果，这是一个新属性，可能有的*/
  /*浏览器不支持但是一般的移动端都是支持此属性的，用css就这样一个简单的属性即可实现，如果*/
  /*是使用js可能就需要监听滚动条再给组件不同的状态效果。在项目使用了better-scroll之后*/
  /*此属性便失去了效果，需要重新实现了*!*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/
  /* .content:给首页的中间部分内容设置大小，方案一：定位，直接让它的大小等于视口大小
  减去顶部标题栏再减去底部导航栏剩下的既是它的大小；
  方案二：使用height: calc(100% - 93px);自行计算但是不推荐,不同尺寸屏幕兼容性不足
  */
  .content {
    overflow: hidden;
    position: absolute; /*绝对定位：相对于父元素的定位*/
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
  }

  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
  .tab-control {
    position: relative;
    z-index: 9;
  }


</style>
