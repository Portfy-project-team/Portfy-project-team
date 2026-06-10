import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import LoginView from '../pages/auth/Login.vue'

const routes = [
  { path: '/',         redirect: '/home' },
  { path: '/login',    name: 'login',    component: LoginView },
  { path: '/register', name: 'register', component: () => import('../pages/auth/Register.vue') },
  { path: '/home',     name: 'home',     component: () => import('../pages/PageHome.vue') },
  { path: '/pagehome', name: 'pagehome', component: () => import('../pages/PageHome.vue') },

  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/auth/ForgotPassward.vue')
  },

  // ── STUDENT — authentification + role STUDENT requis ──────────
  {
    path: '/student/dashboard',
    name: 'student-dashboard',
    component: () => import('../pages/student/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/projects',
    name: 'student-projects',
    component: () => import('../pages/student/Projects.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/stages',
    name: 'student-stages',
    component: () => import('../pages/student/Stages.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/competences',
    name: 'student-competences',
    component: () => import('../pages/student/Competences.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/activites',
    name: 'student-activites',
    component: () => import('../pages/student/Activites.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/formations',
    name: 'student-formations',
    component: () => import('../pages/student/Formations.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/lettres',
    name: 'student-lettres',
    component: () => import('../pages/student/Lettres.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/portfolio',
    name: 'student-portfolio',
    component: () => import('../pages/student/Portfolio.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/notifications',
    name: 'student-notifications',
    component: () => import('../pages/student/Notifications.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/parametres',
    name: 'student-parametres',
    component: () => import('../pages/student/Parametres.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/badges',
    name: 'student-badges',
    component: () => import('../pages/student/Badges.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/commentaires',
    name: 'student-commentaires',
    component: () => import('../pages/student/Commentaires.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/reseau',
    name: 'student-reseau',
    component: () => import('../pages/student/Reseau.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/historique',
    name: 'student-historique',
    component: () => import('../pages/student/Historique.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },
  {
    path: '/student/aide',
    name: 'student-aide',
    component: () => import('../pages/student/Aide.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] }
  },

  // ── PUBLIC PORTFOLIO — accessible sans auth ───────────────────
  {
    path: '/portfolio/:slug',
    name: 'public-portfolio',
    component: () => import('../pages/student/PublicPortfolio.vue')
  },

  // ── PROFESSOR — authentification + role PROF requis ──────────
  {
    path: '/professor/recommandations',
    name: 'professor-recommandations',
    component: () => import('../pages/professor/Recommandations.vue'),
    meta: { requiresAuth: true, roles: ['PROF'] }
  },
  {
    path: '/professor/portfolios-consultes',
    name: 'professor-portfolios-consultes',
    component: () => import('../pages/professor/PortfoliosConsultes.vue'),
    meta: { requiresAuth: true, roles: ['PROF'] }
  },
  {
    path: '/professor/commentaires',
    name: 'professor-commentaires',
    component: () => import('../pages/professor/Commentaires.vue'),
    meta: { requiresAuth: true, roles: ['PROF'] }
  },
  {
    path: '/professor/parametres',
    name: 'professor-parametres',
    component: () => import('../pages/professor/Parametres.vue'),
    meta: { requiresAuth: true, roles: ['PROF'] }
  },
  {
    path: '/professor/aide',
    name: 'professor-aide',
    component: () => import('../pages/professor/Aide.vue'),
    meta: { requiresAuth: true, roles: ['PROF'] }
  },

  // ── ADMIN — authentification + role ADMIN requis ─────────────
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('../pages/admin/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../pages/admin/Users.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },
  {
    path: '/admin/users/:id',
    name: 'admin-user-detail',
    component: () => import('../pages/admin/UserDetail.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },
  {
    path: '/admin/establishments',
    name: 'admin-establishments',
    component: () => import('../pages/admin/Establishments.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },
  {
    path: '/admin/moderation',
    name: 'admin-moderation',
    component: () => import('../pages/admin/Moderation.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },
  {
    path: '/admin/attestations',
    name: 'admin-attestations',
    component: () => import('../pages/admin/Attestations.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },
  {
    path: '/admin/statistics',
    name: 'admin-statistics',
    component: () => import('../pages/admin/Statistics.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('../pages/admin/Settings.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },

  // ── 404 — toujours en dernier ─────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// CORRECTION 1 : Navigation guard global
// La version originale n'avait AUCUN guard — n'importe qui pouvait
// accéder à /admin/dashboard ou /student/parametres sans être connecté
// en tapant simplement l'URL dans le navigateur
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Route sans protection — laisser passer
  if (!to.meta.requiresAuth) {
    // Si déjà connecté et tente d'accéder au login/register — rediriger
    if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
      return next({ name: `${authStore.user.role.toLowerCase()}-dashboard` })
    }
    return next()
  }

  // Route protégée — vérifier l'authentification
  if (!authStore.isAuthenticated) {
    // Tenter un refresh silencieux avant de rediriger vers login
    await authStore.fetchUser()
    if (!authStore.isAuthenticated) {
      return next({ name: 'login' })
    }
  }

  // Vérifier le rôle
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    // Utilisateur connecté mais mauvais rôle — rediriger vers son dashboard
    const role = authStore.user?.role?.toLowerCase()
    if (role === 'student') return next({ name: 'student-dashboard' })
    if (role === 'prof')    return next({ name: 'professor-recommandations' })
    if (role === 'admin')   return next({ name: 'admin-dashboard' })
    return next({ name: 'home' })
  }

  next()
})

export default router