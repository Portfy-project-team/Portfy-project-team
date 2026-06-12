import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  { path: '/login',           name: 'Login',          component: () => import('../pages/auth/Login.vue') },
  { path: '/register',        name: 'Register',       component: () => import('../pages/auth/Register.vue') },
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
  { path: '/admin/users',           name: 'AdminUsers',           component: () => import('../pages/admin/Users.vue'),           meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/users/:id',       name: 'AdminUserDetail',      component: () => import('../pages/admin/UserDetail.vue'),      meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/moderation',      name: 'AdminModeration',      component: () => import('../pages/admin/Moderation.vue'),      meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/establishments',  name: 'AdminEtablissements',  component: () => import('../pages/admin/Establishments.vue'),  meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/statistics',      name: 'AdminStatistiques',    component: () => import('../pages/admin/Statistics.vue'),    meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/attestations',    name: 'AdminAttestations',    component: () => import('../pages/admin/Attestations.vue'),    meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/settings',        name: 'AdminParametres',      component: () => import('../pages/admin/Settings.vue'),        meta: { requiresAuth: true, role: 'ADMIN' } },

  // ── Student ───────────────────────────────────────────────────────────────
  { path: '/student/dashboard',     name: 'Dashboard',            component: () => import('../pages/student/Dashboard.vue'),    meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/projects',      name: 'student-projects',     component: () => import('../pages/student/Projects.vue'),     meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/stages',        name: 'student-stages',       component: () => import('../pages/student/Stages.vue'),       meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/competences',    name: 'student-competences',  component: () => import('../pages/student/Competences.vue'),  meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/activites',      name: 'student-activites',    component: () => import('../pages/student/Activites.vue'),    meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/formations',     name: 'student-formations',   component: () => import('../pages/student/Formations.vue'),   meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/badges',         name: 'student-badges',       component: () => import('../pages/student/Badges.vue'),       meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/lettres',        name: 'student-lettres',      component: () => import('../pages/student/Lettres.vue'),      meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/portfolio',      name: 'student-portfolio',    component: () => import('../pages/student/Portfolio.vue'),    meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/commentaires',   name: 'student-commentaires', component: () => import('../pages/student/Commentaires.vue'), meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/historique',     name: 'student-historique',   component: () => import('../pages/student/Historique.vue'),   meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/reseau',         name: 'student-reseau',       component: () => import('../pages/student/Reseau.vue'),       meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/notifications',  name: 'student-notifications',component: () => import('../pages/student/Notifications.vue'),meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/parametres',     name: 'student-parametres',    component: () => import('../pages/student/Parametres.vue'),   meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/aide',           name: 'student-aide',          component: () => import('../pages/student/Aide.vue'),         meta: { requiresAuth: true, role: 'STUDENT' } },

  // ── Professional ──────────────────────────────────────────────────────────
  {
    path: '/pro',
    component: () => import('../components/pro/ProLayout.vue'),
    meta: { requiresAuth: true, role: 'PRO' },
   children: [
  {
    path: 'dashboard',
    name: 'ProDashboard',
    component: () => import('../pages/pro/Dashboard.vue')
  },
  {
    path: 'recherche-talents',
    name: 'ProTalentSearch',
    component: () => import('../pages/pro/TalentSearch.vue')
  },
  {
  path: 'recommandations',
  name: 'ProRecommendations',
  component: () => import('../pages/pro/Recommandations.vue')
}

]
  },

  // ── Public ────────────────────────────────────────────────────────────────
 {
  path: '/portfolio/:studentId',
  name: 'public-portfolio',
  component: () =>
    import('../pages/student/PublicPortfolio.vue')
},
  { path: '/conditions',            name: 'conditions',           component: () => import('../pages/Conditions.vue') },
  { path: '/politique',             name: 'politique',            component: () => import('../pages/Politique.vue') },

  // ── Home/Dashboard Redirect ───────────────────────────────────────────────
  { 
    path: '/dashboard', 
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('portfy_user'))
      if (user?.role === 'PROF')    return '/professor/dashboard'
      if (user?.role === 'STUDENT') return '/student/dashboard'
      if (user?.role === 'ADMIN')   return '/admin/dashboard'
      if (user?.role === 'PRO')     return '/pro/dashboard'
      return '/login'
    }
  },
  { path: '/', redirect: '/dashboard' },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
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
    if (user.role === 'STUDENT') { next({ name: 'Dashboard'      }); return }
    if (user.role === 'PRO')     { next({ name: 'ProDashboard'   }); return }
    next({ name: 'Login' }); return
  }

  next()
})

export default router
