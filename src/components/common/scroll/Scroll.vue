<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props: {  //probeType决定是否要实时监听滚动条，而值由调用者传入，封装的思想
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
   },
    mounted() {   //生命周期函数，使组件一旦创立好后就执行内部函数
      //1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      //2.监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          this.$emit('scroll', position)
        })
      }
      //监听上拉事件
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }


    },
    methods:{
      //.scrollTo是scroll的内部方法可以实现指定位置定位滚动条
      scrollTo(x,y,time=500) {
        this.scroll && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }

  }
</script>

<style scoped>

</style>
