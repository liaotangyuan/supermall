<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goods-item="item"/>
  </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";

export default {
  name: "GoodsList",
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    GoodsListItem,
  }
}
</script>

<style scoped>
 .goods {
   display: flex;
   flex-wrap: wrap; /*此属性会根据每个元素的宽度设置每行显示的个数*/
   justify-content: space-around; /*此属性会均等分每个元素间的间距*/
   padding: 2px;
 }

</style>
