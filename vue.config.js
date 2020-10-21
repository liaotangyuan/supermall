module.exports = {
  configureWebpack: {
    resolve: {
      alias: {  //给文件路径起别名
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}
