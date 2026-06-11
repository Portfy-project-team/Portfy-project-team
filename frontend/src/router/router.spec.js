import { describe, it, expect, beforeEach } from 'vitest'
import router from './router'

describe('router', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('la route racine redirige vers /home', () => {
    const rootRoute = router.getRoutes().find((route) => route.path === '/')

    expect(rootRoute).toBeDefined()
    expect(rootRoute.redirect).toBe('/home')
  })

  it('contient les routes auth principales', () => {
    expect(router.resolve('/login').name).toBe('login')
    expect(router.resolve('/register').name).toBe('register')
    expect(router.resolve('/pending').name).toBe('pending')
    expect(router.resolve('/forgot-password').name).toBe('forgot-password')
  })

  it('contient les routes conditions et politique', () => {
    expect(router.resolve('/conditions').name).toBe('conditions')
    expect(router.resolve('/politique').name).toBe('politique')
  })

  it('redirige /dashboard vers /professor/dashboard si user est PROF', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        role: 'PROF',
      })
    )

    const dashboardRoute = router.getRoutes().find((route) => route.path === '/dashboard')

    expect(dashboardRoute).toBeDefined()
    expect(dashboardRoute.redirect()).toBe('/professor/dashboard')
  })

  it('redirige /dashboard vers /student/dashboard si user est STUDENT', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        role: 'STUDENT',
      })
    )

    const dashboardRoute = router.getRoutes().find((route) => route.path === '/dashboard')

    expect(dashboardRoute).toBeDefined()
    expect(dashboardRoute.redirect()).toBe('/student/dashboard')
  })

  it('redirige /dashboard vers /login si aucun user connecté', () => {
    const dashboardRoute = router.getRoutes().find((route) => route.path === '/dashboard')

    expect(dashboardRoute).toBeDefined()
    expect(dashboardRoute.redirect()).toBe('/login')
  })

  it('contient la route dashboard professor', () => {
    const route = router.resolve('/professor/dashboard')

    expect(route.name).toBe('prof-dashboard')
    expect(route.path).toBe('/professor/dashboard')
  })

  it('contient les routes professor', () => {
    expect(router.resolve('/professor/recommandations').name).toBe('professor-recommandations')
    expect(router.resolve('/professor/portfolios-consultes').name).toBe('professor-portfolios-consultes')
    expect(router.resolve('/professor/commentaires').name).toBe('professor-commentaires')
    expect(router.resolve('/professor/parametres').name).toBe('professor-parametres')
    expect(router.resolve('/professor/aide').name).toBe('professor-aide')
    expect(router.resolve('/professor/generer-lettre').name).toBe('professor-generer-lettre')
  })

  it('contient les routes student', () => {
    expect(router.resolve('/student/dashboard').name).toBe('student-dashboard')
    expect(router.resolve('/student/aide').name).toBe('student-aide')
    expect(router.resolve('/student/activites').name).toBe('student-activites')
    expect(router.resolve('/student/badges').name).toBe('student-badges')
    expect(router.resolve('/student/formations').name).toBe('student-formations')
    expect(router.resolve('/student/projects').name).toBe('student-projects')
    expect(router.resolve('/student/stages').name).toBe('student-stages')
    expect(router.resolve('/student/competences').name).toBe('student-competences')
    expect(router.resolve('/student/commentaires').name).toBe('student-commentaires')
    expect(router.resolve('/student/reseau').name).toBe('student-reseau')
    expect(router.resolve('/student/historique').name).toBe('student-historique')
    expect(router.resolve('/student/lettres').name).toBe('student-lettres')
    expect(router.resolve('/student/portfolio').name).toBe('student-portfolio')
    expect(router.resolve('/student/notifications').name).toBe('student-notifications')
    expect(router.resolve('/student/parametres').name).toBe('student-parametres')
  })

  it('contient la route portfolio public avec slug', () => {
    const route = router.resolve('/portfolio/youssef-zailachi')

    expect(route.name).toBe('public-portfolio')
    expect(route.params.slug).toBe('youssef-zailachi')
  })

  it('redirige /admin vers /admin/dashboard', () => {
    const adminRoute = router.getRoutes().find((route) => route.path === '/admin')

    expect(adminRoute).toBeDefined()
    expect(adminRoute.redirect).toBe('/admin/dashboard')
  })

  it('contient les routes admin', () => {
    expect(router.resolve('/admin/dashboard').name).toBe('admin-dashboard')
    expect(router.resolve('/admin/users').name).toBe('admin-users')
    expect(router.resolve('/admin/users/10').name).toBe('admin-user-detail')
    expect(router.resolve('/admin/users/10').params.id).toBe('10')
    expect(router.resolve('/admin/establishments').name).toBe('admin-establishments')
    expect(router.resolve('/admin/moderation').name).toBe('admin-moderation')
    expect(router.resolve('/admin/attestations').name).toBe('admin-attestations')
    expect(router.resolve('/admin/statistics').name).toBe('admin-statistics')
    expect(router.resolve('/admin/settings').name).toBe('admin-settings')
  })

  it('contient une route catch-all qui redirige vers /home', () => {
    const notFoundRoute = router
      .getRoutes()
      .find((route) => route.path === '/:pathMatch(.*)*')

    expect(notFoundRoute).toBeDefined()
    expect(notFoundRoute.redirect).toBe('/home')
  })
})