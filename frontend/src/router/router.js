import { createRouter, createWebHistory } from 'vue-router'

// Importations dyal l-Pages (Views)
// Login hiya l-oūlā li ghadi i-chouf l-user
import LoginView from '../pages/auth/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    // Lazy loading 3la hsāb l-fichiers li wast pages/auth/
    component: () => import('../pages/auth/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/auth/ForgotPassward.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // Dashboard rāh khārej l-dossier auth kima bāyen f l-image
    component: () => import('../pages/Dashboard.vue')
  },
  {
  path: '/:pathMatch(.*)*',
  redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router