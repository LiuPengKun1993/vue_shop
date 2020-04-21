import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  // 路由重定向
  { path: '/', redirect: '/login' }
]

const router = new VueRouter({
  routes
})

export default router
