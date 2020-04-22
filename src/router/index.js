import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  // 路由重定向
  { path: '/', redirect: '/login' },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 为路由对象添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是登录页，直接放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
