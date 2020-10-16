import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Right from '../components/right/Right.vue'
import Role from '../components/right/Role.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Right },
      { path: '/roles', component: Role }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由守航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 是从哪个路径来的
  // next 放行 1.直接放行 next() 2.next('/login') 强制跳转
  // 如果是登录请求，直接放行
  if (to.path === '/login') {
    return next()
  }
  // 不是登录页面，需要携带token，否则强制跳转到登录页面
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  // 访问有权限页面并且携带了token，直接放行
  next()
})
export default router
