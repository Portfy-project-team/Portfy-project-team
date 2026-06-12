import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  { path: '/login',           name: 'Login',          component: () => import('../pages/auth/Login.vue') },
  { path: '/register',        name: 'Register',       component: () => import('../pages/auth/Register.vue') },
  { path: '/register/google', name: 'RegisterGoogle', component: () => import('../pages/auth/Register.vue') },
  { path: '/pending',         name: 'Pending',        component: () => import('../pages/auth/PendingValidation.vue') },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../pages/auth/ForgotPassward.vue') },

  // ── Professor ─────────────────────────────────────────────────────────────
  {
  path: '/professor',
  component: () => import('../components/professor/ProfLayout.vue'),
  meta: { requiresAuth: true, role: 'PROF' },
  children: [
    { path: 'dashboard',            name: 'ProfDashboard',       component: () => import('../pages/professor/Dashboard.vue') },
    { path: 'portfolios-consultes', name: 'ProfPortfolios',      component: () => import('../pages/professor/PortfoliosConsultes.vue') },
    { path: 'recommandations',      name: 'ProfRecommandations', component: () => import('../pages/professor/Recommandations.vue') },
    { path: 'generer-lettre',       name: 'ProfGenererLettre',   component: () => import('../pages/professor/GenererLettre.vue') },
    { path: 'commentaires',         name: 'ProfCommentaires',    component: () => import('../pages/professor/Commentaires.vue') },
    { path: 'parametres',           name: 'ProfParametres',      component: () => import('../pages/professor/Parametres.vue') },
    { path: 'aide',                 name: 'ProfAide',            component: () => import('../pages/professor/Aide.vue') },
  ]
},
  // ── Admin ─────────────────────────────────────────────────────────────────
  { path: '/admin/dashboard',       name: 'AdminDashboard',       component: () => import('../pages/admin/AdminDashboard.vue'),       meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/users',           name: 'AdminUsers',           component: () => import('../pages/admin/AdminUsers.vue'),          meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/users/:id',       name: 'AdminUserDetail',      component: () => import('../pages/admin/AdminUserDetail.vue'),     meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/moderation',      name: 'AdminModeration',      component: () => import('../pages/admin/AdminModeration.vue'),     meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/etablissements',  name: 'AdminEtablissements',  component: () => import('../pages/admin/AdminEtablissements.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/statistiques',    name: 'AdminStatistiques',    component: () => import('../pages/admin/AdminStatistiques.vue'),   meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/attestations',    name: 'AdminAttestations',    component: () => import('../pages/admin/AdminAttestations.vue'),   meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/admin/parametres',      name: 'AdminParametres',      component: () => import('../pages/admin/AdminParametres.vue'),     meta: { requiresAuth: true, role: 'ADMIN' } },

  // ── Redirections ──────────────────────────────────────────────────────────
  { path: '/',                redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ── Guard global ──────────────────────────────────────────────────────────────
router.beforeEach((to, _from, next) => {
  //if (!to.meta.requiresAuth) { next(); return }

  //const raw  = localStorage.getItem('portfy_user')
  //const user = raw ? JSON.parse(raw) : null

  //if (!user) { next({ name: 'Login' }); return }

  // Redirige selon le rôle si la route est protégée par un rôle spécifique
  //if (to.meta.role && user.role !== to.meta.role) {
    //if (user.role === 'PROF')    { next({ name: 'ProfDashboard'  }); return }
    //if (user.role === 'ADMIN')   { next({ name: 'AdminDashboard' }); return }
    //next({ name: 'Login' }); return
  //}

  next()
})

export default router