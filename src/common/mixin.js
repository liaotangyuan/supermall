import {debounce} from "./utils";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      nreRefresh: null
    }
  },
  mounted() {
    // 1.将图片加载完后调用刷新界面的函数传入防抖动函数中
    //监听item中图片加载完成发出的itemImageLoad事件
    this.nreRefresh = debounce(this.$refs.scroll.refresh,200)
    //监听图片加载完成再调用refresh函数刷新scroll保存的子组件高度即可
    this.itemImgListener = () => {
      this.nreRefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}
