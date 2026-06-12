import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/auth/Login.vue'
import Conditions from '../pages/Conditions.vue'
import Politique from '../pages/Politique.vue'

const routes = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  { path: '/login',           name: 'Login',          component: () => import('../pages/auth/Login.vue') },
  { path: '/register',        name: 'Register',       component: () => import('../pages/auth/Register.vue') },
  { path: '/register/google', name: 'RegisterGoogle', component: () => import('../pages/auth/Register.vue') },
  { path: '/pending',         name: 'Pending',        component: () => import('../pages/auth/PendingValidation.vue') },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../pages/auth/ForgotPassward.vue') },

  // ── Professor ─────────────────────────────────────────────────────────────
  { path: '/professor/dashboard',           name: 'ProfDashboard',        component: () => import('../pages/professor/Dashboard.vue'),          meta: { requiresAuth: true, role: 'PROF' } },
  { path: '/professor/portfolios-consultes',name: 'ProfPortfolios',       component: () => import('../pages/professor/PortfoliosConsultes.vue'), meta: { requiresAuth: true, role: 'PROF' } },
  { path: '/professor/recommandations',     name: 'ProfRecommandations',  component: () => import('../pages/professor/Recommandations.vue'),     meta: { requiresAuth: true, role: 'PROF' } },
  { path: '/professor/generer-lettre',      name: 'ProfGenererLettre',    component: () => import('../pages/professor/GenererLettre.vue'),       meta: { requiresAuth: true, role: 'PROF' } },
  { path: '/professor/commentaires',        name: 'ProfCommentaires',     component: () => import('../pages/professor/Commentaires.vue'),        meta: { requiresAuth: true, role: 'PROF' } },
  { path: '/professor/parametres',          name: 'ProfParametres',       component: () => import('../pages/professor/Parametres.vue'),          meta: { requiresAuth: true, role: 'PROF' } },
  { path: '/professor/aide',                name: 'ProfAide',             component: () => import('../pages/professor/Aide.vue'),                meta: { requiresAuth: true, role: 'PROF' } },

  // ── Admin ─────────────────────────────────────────────────────────────────

  { path: '/admin/dashboard',       name: 'AdminDashboard',       component: () => import('../pages/admin/Dashboard.vue'),       meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/users',           name: 'AdminUsers',           component: () => import('../pages/admin/Users.vue'),          meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/users/:id',       name: 'AdminUserDetail',      component: () => import('../pages/admin/UserDetail.vue'),     meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/moderation',      name: 'AdminModeration',      component: () => import('../pages/admin/Moderation.vue'),     meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/etablissements',  name: 'AdminEtablissements',  component: () => import('../pages/admin/Establishments.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/statistiques',    name: 'AdminStatistiques',    component: () => import('../pages/admin/Statistics.vue'),   meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/attestations',    name: 'AdminAttestations',    component: () => import('../pages/admin/Attestations.vue'),   meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/parametres',      name: 'AdminParametres',      component: () => import('../pages/admin/Settings.vue'),     meta: { requiresAuth: true, role: 'ADMIN' } },

  // ── Redirections ──────────────────────────────────────────────────────────
  { path: '/',                redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' },


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

  // STUDENT ROUTES
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

  // PUBLIC PORTFOLIO
  {
    path: '/portfolio/:slug',
    name: 'public-portfolio',
    component: () => import('../pages/student/PublicPortfolio.vue')
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ── Guard global ──────────────────────────────────────────────────────────────
router.beforeEach((to, _from, next) => {
  if (!to.meta.requiresAuth) { next(); return }

  const raw  = localStorage.getItem('portfy_user')
  const user = raw ? JSON.parse(raw) : null

  if (!user) { next({ name: 'Login' }); return }

  // Redirige selon le rôle si la route est protégée par un rôle spécifique
  if (to.meta.role && user.role !== to.meta.role) {
    if (user.role === 'PROF')    { next({ name: 'ProfDashboard'  }); return }
    if (user.role === 'ADMIN')   { next({ name: 'AdminDashboard' }); return }
    next({ name: 'Login' }); return
  }

  next()
})

export default router