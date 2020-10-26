<template>
  <div class="bottom-bar">
    <div class="bar-item bar-left">
      <div>
        <i class="icon service"></i>
        <span class="text">客服</span>
      </div>
      <div>
        <i class="icon shop"></i>
        <span class="text">店铺</span>
      </div>
      <div>
        <i class="icon select"></i>
        <span class="text">收藏</span>
      </div>
    </div>
    <div class="bar-item bar-right">
      <div class="cart" @click="cartClick">加入购物车</div>
      <div class="buy" @click="buyClick">购买</div>
    </div>
    <!--    <sport-ball ref="ball" class="sport-ball"></sport-ball>-->
  </div>
</template>

<script>
export default {
  name: "DetailBottomBar",
  methods: {
    cartClick() {
      this.$emit('addCart')
    },
    buyClick() {
      this.$toast.show('抱歉！暂未开通哦', 2500)
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    height: 58px;
    background-color: #fff;
    position: relative;
    /*bottom: 49px;*/
    display: flex;
    text-align: center;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
  }
  .bar-item {
    flex: 1;
    display: flex;
  }

  .bar-item>div {
    flex: 1;
  }

  .bar-left .text {
    font-size: 13px;
  }


  .bar-left .icon {
    display: block;
    width: 20px;
    height: 20px;
    margin: 5px auto 0;
    background: url("~assets/img/detail/detail_bottom.png");
    background-size: 100%;
  }

  .bar-left .service {
    background-position: 0 -48px;
  }

  .bar-left .shop {
    background-position: 0 -90px;
  }

  .bar-right {
    font-size: 15px;
    color: #fff;
    line-height: 44px;
  }

  .bar-right .cart {
    background-color: #ffe817;
    color: #333;
  }

  .bar-right .buy {
    background-color: #f69;
  }

</style>
