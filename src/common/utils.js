//工具类

/* 1.给每张图片加载完成后调用refresh方法刷新界面的时间添加防抖函数，
使得该事件不会很频繁的调用 */
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    },delay)
  }
}
