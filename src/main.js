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
// 导入富文本依赖
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // for bubble theme
Vue.use(VueQuillEditor /* { default global options } */)
Vue.component('tree-table', ZkTable)
// 请求拦截
axios.interceptors.request.use(config => {
  // 设置请求头，除了登录接口外其他接口都要带上
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 添加时间过滤器
Vue.filter('dateFormate', (timestamp) => {
  const dt = new Date(timestamp * 1000)
  // 年
  const y = (dt.getFullYear() + '').padStart(2, '0')
  // 月
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 日
  const d = (dt.getDate() + '').padStart(2, '0')
  // 时
  const h = (dt.getHours() + '').padStart(2, '0')
  // 分
  const min = (dt.getMinutes() + '').padStart(2, '0')
  // 秒
  const s = (dt.getSeconds() + '').padStart(2, '0')
  // 返回指定格式的时间
  return `${y}-${m}-${d} ${h}:${min}:${s}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
