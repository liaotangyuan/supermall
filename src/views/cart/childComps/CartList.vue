<template>
  <div class="cart-list">
    <scroll class="center" ref="scroll">
      <cart-list-item
        v-for="(item,index) in list"
        :item-info="item"
        :key="index"/>
    </scroll>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Scroll from "components/common/scroll/Scroll";
import CartListItem from "./CartListItem";

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  activated() { //每次进入购物车都刷新可滚动区域
    this.$refs.scroll.refresh();
  },
  computed: {
    //两种语法: 1.数组语法
    // ...mapGetters(['cartLength','cartList'])
    // 2.对象语法：对象语法可以给方法改别名
    ...mapGetters({
      list: 'cartList'
    }),
  },
}
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 40px);
  }
  .center {
    height: 100%;
    overflow: hidden;
  }


</style>
