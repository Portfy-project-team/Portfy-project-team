import { createRouter, createWebHistory } from 'vue-router'

// Importations dyal l-Pages (Views)
// Login hiya l-oūlā li ghadi i-chouf l-user
import LoginView from '../pages/auth/Login.vue'
import Conditions from '../pages/Conditions.vue'
import Politique from '../pages/Politique.vue'

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
    path: '/pending',                                                          // ← ajoute ici
    name: 'pending',
    component: () => import('../pages/auth/PendingValidation.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/auth/ForgotPassward.vue')
  },
  {
  path: '/dashboard',
  redirect: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.role === 'PROF')    return '/professor/dashboard'
    if (user?.role === 'STUDENT') return '/student/dashboard'
    return '/login'
  }
},
{
  path: '/professor',
  component: () => import('../components/professor/ProfLayout.vue'),
  children: [
    {
      path: 'dashboard',
      name: 'prof-dashboard',
      component: () => import('../pages/professor/Dashboard.vue'),
    }
  ]
},
  {
    path: '/conditions',
    name: 'conditions',
    component: () => import('../pages/Conditions.vue')
  },
  {
    path: '/politique',
    name: 'politique',
    component: () => import('../pages/Politique.vue')
  },
  { path: '/professor/generer-lettre', 
    name: 'professor-generer-lettre', 
    component: () => import('../pages/professor/GenererLettre.vue') 
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