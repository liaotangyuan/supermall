import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import toast from 'components/common/toast'
import FastClick from 'fastclick'
import VueLazyLoad from "vue-lazyload"

Vue.config.productionTip = false
//为事件总线的$bus创建Vue实例
Vue.prototype.$bus = new Vue()

//安装toast插件
Vue.use(toast)

//解决移动端300毫秒延迟问题
FastClick.attach(document.body)

//使用图片懒加载的插件
Vue.use(VueLazyLoad, {
  //loading：使用图片占位，原图片未渲染出来时会显示此占位图
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
