import { createRouter, createWebHistory } from 'vue-router'
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
    component: () => import('../pages/auth/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/auth/ForgotPassward.vue')
  },
  {
  path: '/student/aide',
  name: 'student-aide',
  component: () => import('../pages/student/Aide.vue')
},
  {
  path: '/student/activites',
  name: 'student-activites',
  component: () => import('../pages/student/Activites.vue')
},
{
path: '/student/badges',
name: 'student-badges',
component: () => import('../pages/student/Badges.vue')
},
{
  path: '/student/formations',
  name: 'student-formations',
  component: () => import('../pages/student/Formations.vue')
},
{
  path: '/student/dashboard',
  name: 'student-dashboard',
  component: () => import('../pages/student/Dashboard.vue')
},
{
  path: '/student/projects',
  name: 'student-projects',
  component: () => import('../pages/student/Projects.vue')
},
{
 path: '/student/stages',
 name: 'student-stages',
 component: () => import('../pages/student/Stages.vue')
},
{
  path: '/student/competences',
  name: 'student-competences',
  component: () => import('../pages/student/Competences.vue')
},
{
  path: '/student/commentaires',
  name: 'student-commentaires',
  component: () => import('../pages/student/Commentaires.vue')
},
{
  path: '/student/reseau',
  name: 'student-reseau',
  component: () => import('../pages/student/Reseau.vue')
},
{
  path: '/student/historique',
  name: 'student-historique',
  component: () => import('../pages/student/Historique.vue')
},
{
  path: '/student/lettres',
  name: 'student-lettres',
  component: () => import('../pages/student/Lettres.vue')
},
{
  path: '/student/portfolio',
  name: 'student-portfolio',
  component: () => import('../pages/student/Portfolio.vue')
},
{
  path: '/student/notifications',
  name: 'student-notifications',
  component: () => import('../pages/student/Notifications.vue')
},
{
  path: '/student/parametres',
  name: 'student-parametres',
  component: () => import('../pages/student/Parametres.vue')
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
  {
  path: '/:pathMatch(.*)*',
  redirect: '/login'
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router