import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 5000
  })
  // // 2.axios的拦截器
  // //2.1请求拦截的作用
  // instance.interceptors.request.use(res => {//拦截成功
  //   // console.log(res);
  //   return res
  // },err => {//拦截失败
  //   // console.log(err);
  // })
  // //2.2响应拦截
  // instance.interceptors.request.use(res => {//响应成功
  //   // console.log(res);
  //   return res.data
  // },err => {//响应失败
  //   // console.log(err);
  // })

  // 3.发送真正的网络请求
  return instance(config)
}
