import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/user/Roles.vue'
import Rights from '../components/user/Rights.vue'
import Categories from '../components/user/Categories.vue'
import Goods from '../components/user/Goods.vue'
import Orders from '../components/user/Orders.vue'
import Params from '../components/user/Params.vue'
import Reports from '../components/user/Reports.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  // 路由重定向
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/reports', component: Reports },
      { path: '/params', component: Params },
      { path: '/orders', component: Orders },
      { path: '/goods', component: Goods },
      { path: '/categories', component: Categories }
    ]
  }
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
