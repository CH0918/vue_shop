import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图表
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/gloabal.css'
// 导入axios
import axios from 'axios'
// 导入第三方表格依赖
import ZkTable from 'vue-table-with-tree-grid'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.component('tree-table', ZkTable)
// 请求拦截
axios.interceptors.request.use(config => {
  // 设置请求头，除了登录接口外其他接口都要带上
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
