import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Detail from '../views/Detail.vue'
import Feedbacklist from '../views/Feedbacklist.vue'
import Announcement from '../views/Announcement.vue'
import Order from '../views/Order.vue'
import Ordercenter from '../views/Ordercenter.vue'
import Orderdetail from '../views/Orderdetail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/announcement',
    name: 'Announcement',
    component: Announcement
  },
  {
    path: '/feedbacklist',
    name: 'Feedbacklist',
    component: Feedbacklist
  },
  {
    path: '/order',
    name: 'Order',
    component: Order
  },
  {
    path: '/ordercenter',
    name: 'Ordercenter',
    component: Ordercenter
  },
  {
    path: '/orderdetail',
    name: 'Orderdetail',
    component: Orderdetail
  },
]

const router = new VueRouter({
  routes
})

export default router
