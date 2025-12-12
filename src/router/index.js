import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import HouseDetails from '../views/HouseDetails.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/details/:id',
    name: 'HouseDetails',
    component: HouseDetails,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
