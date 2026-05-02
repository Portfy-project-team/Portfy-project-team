import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/auth/Login.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView 
  },
  { 
    path: '/register', 
    name: 'register', 
    component: () => import('../pages/auth/Register.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 