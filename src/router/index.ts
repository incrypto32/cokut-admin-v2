import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Meals from '../views/Meals.vue'
import Order from '../views/Order.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/meals/:rid',
    name: 'meals',
    component: Meals
  },

  {
    path: '/orders',
    name: 'orders',
    component: Order
  },
  {
    path:'/authenticate',
    name:'Auth',
    component:Home,

  },
  {
    path: '/about',
    name: 'Meals',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Meals.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
