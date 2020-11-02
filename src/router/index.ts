import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Meals from '../views/Meals.vue'
import Order from '../views/Order.vue'
import { fire } from '@/ts/firebase_helper'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    children:[

      {
        path: '/',
        name: 'home',
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
        path: '/about',
        name: 'Meals',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Meals.vue')
      }
    ],

   
    component: Main
  },

  {
    path:'/login',
    name:'login',
    component:Login,

  },

  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !fire.auth.currentUser) next({ name: 'login' })
  else next()
})

export default router
