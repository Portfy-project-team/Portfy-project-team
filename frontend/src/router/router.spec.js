import { describe, expect, test } from 'vitest'
import router from './router'

describe('router', () => {
  test('la route racine redirige vers /login', () => {
    const routes = router.getRoutes()
    const rootRoute = routes.find((route) => route.path === '/')

    expect(rootRoute).toBeDefined()
    expect(rootRoute.redirect).toBe('/login')
  })

  test('contient la route /login', () => {
    const route = router.resolve('/login')

    expect(route.name).toBe('login')
    expect(route.path).toBe('/login')
  })

  test('contient la route /register', () => {
    const route = router.resolve('/register')

    expect(route.name).toBe('register')
    expect(route.path).toBe('/register')
  })

  test('contient la route /forgot-password', () => {
    const route = router.resolve('/forgot-password')

    expect(route.name).toBe('forgot-password')
    expect(route.path).toBe('/forgot-password')
  })

  test('contient la route /dashboard', () => {
    const route = router.resolve('/dashboard')

    expect(route.name).toBe('dashboard')
    expect(route.path).toBe('/dashboard')
  })

  test('contient une route catch-all pour les routes inconnues', () => {
    const routes = router.getRoutes()
    const notFoundRoute = routes.find((route) => route.path === '/:pathMatch(.*)*')

    expect(notFoundRoute).toBeDefined()
    expect(notFoundRoute.redirect).toBe('/login')
  })
})