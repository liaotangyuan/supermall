<template>
  <div class="cart">
    <!--  1.标题栏  -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!--  2.数据列表  -->
    <cart-list/>
    <!--  3.底部汇总  -->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar";
import { mapGetters } from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar

  },
  computed: {
    //两种语法: 1.数组语法
    // ...mapGetters(['cartLength','cartList'])
    // 2.对象语法：对象语法可以给方法改别名
    ...mapGetters({
      length: 'cartLength',
      list: 'cartList'
    })
  },
}
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

</style>
