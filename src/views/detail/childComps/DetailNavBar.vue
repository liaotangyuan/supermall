<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div  class="title-item"
              v-for="(item,index) in titles"
              :class="{active: index === currentIndex}"
              @click="itemClick(index)"
        >{{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

export default {
name: "DetailNavBar",
  components: {
    NavBar,
  },
  data() {
  return {
    titles: ['商品','参数','评论','推荐'],
    currentIndex: 0
  }
  },
  methods: {
    itemClick(index) {  //根据用户的点击修改对应标题栏item的样式
      this.currentIndex = index
      //发出详情页中的title-item的点击事件
      this.$emit('titleClick', index)
    },
    backClick() { //返回键的事件
      this.$router.back()
    }
  }
}
</script>

<style scoped>
  .title {
    display: flex;
    font-size: 13px;
  }
  .title-item {
    flex: 1;
  }
  .active {
    color: var(--color-high-text);
  }
  .back{
    margin-top: 7px;
  }

</style>
