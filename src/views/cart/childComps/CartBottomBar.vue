<template>
  <div id="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-btn"
        :is-checked="isCheckAll"
        @click.native="checkAllClick"/>
      <span>全选</span>
    </div>
    <div class="price" v-show="!isShowMessage">
      合计：<span>￥{{totalPrice}}</span>
    </div>
    <div class="price price-cancel"
         @click="cancelClick"
         v-show="isShowMessage">
      <span>取消</span>
    </div>
    <div class="calculate" @click="calculateClick">
      <span>去结算({{checkLength}})</span>
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";

  import {mapGetters, mapMutations} from 'vuex';

  export default {
    name: "CartBottomBar",
    props: {
      isShowMessage: {
        type: Boolean,
        default: false
      }
    },
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      //1、计算总价
      totalPrice() {
        return this.cartList.filter((item) => {
          return item.checked;
        }).reduce((preValue, item) => {
          return preValue + item.realPrice * item.count;
        }, 0).toFixed(2)
      },
      //2、计算选中个数
      checkLength() {
        return this.cartList.filter((item) => {
          return item.checked;
        }).length;
      },
      //3、全选与单选的实现
      isCheckAll() {
        //every():一假即假 ，而且只要有一个元素是假，其后面的元素将不再遍历。
        //some()：一真即真
        // console.log('AllCheck');
        //商品为0时，全选按钮状态也是false（即不选中状态）
        if(this.cartList.length === 0) {
          return false;
        }
        //1、使用filter
        //return !(this.cartList.filter(item => item.checked).length);
        //2、使用find
        // return !this.cartList.find(item => item.checked);
        //3、普通遍历
        // for(let item of this.cartList) {
        //   if(!item.checked) {
        //     return false;
        //   }
        // }
        // return true;
        //判断商品数组中是否有未选中的，有则全选为false，无则全选为true
        return this.cartList.every(item => item.checked);
      }
    },
    methods: {
      ...mapMutations(["deleteProduct"]),
      //1、全选按钮的点击事件
      checkAllClick() {
        //console.log('checkall');
        //计算属性isCheckAll为true表示当前为全部选中状态，点击全选那就全部不选中
        // if(this.isCheckAll) {
        //   this.cartList.map(item => {
        //     //修改store里面的数据一定要经过mutations，否则调试插件监控不到
        //     this.$store.commit('updateChecked', {item, checked: false});
        //   })
        // }else {
        //   this.cartList.map(item => {
        //     this.$store.commit("updateChecked", {item, checked: true});
        //   })
        // }
        //先判断当前所有商品的选中状态
        if(this.isCheckAll) { //全部已选中时，点击则为全部不选中
          this.cartList.forEach(item => item.checked = false);
        }else { //含未选中的商品时，点击则为全部选中
          this.cartList.forEach(item => item.checked = true);
        }

      },
      //2、点击计算按钮
      calculateClick() {
        if(!this.isCheckAll) {
           this.$toast.show('请选择结算的商品', 2500);
        } else {
          this.$toast.show('抱歉！暂未开通哦', 2500)
        }
      },
      //3、点击取消
      cancelClick() {

      }
    }
  }
</script>

<style scoped>
  #bottom-bar {
    height: 40px;
    position: fixed;
    display: flex;
    bottom: 49px;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
  }

  #bottom-bar .check-content {
    width:auto;
    display: flex;
    flex: 1;
    line-height:40px;
    justify-content: center;
    align-items: center;
  }

  #bottom-bar .check-content .check-btn {
    /*width: 20px;*/
    /*height: 20px;*/
    /*margin-right: 5px;*/
    line-height: 20px;
    display: flex;
    /*flex: 1;*/
    /*position: relative;*/
    /*justify-content: center;*/
    align-items: center;
  }

  .price {
    text-align: center;
    flex: 2;
    /*height: 40px;*/
    line-height: 40px;
  }
  .price span {
    color: var(--color-tint);
  }

  .calculate {
    height: 40px;
    line-height: 40px;
    background-color: var(--color-high-text);
    color: #fff;
    text-align: center;
    flex: 1;
  }
  .price-cancel {
    color: white;
    background-color: var(--color-tint);
  }
</style>
