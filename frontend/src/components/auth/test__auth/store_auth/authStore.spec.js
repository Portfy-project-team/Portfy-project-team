import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { useAuthStore } from '../../../../store/authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('initialise user à null et isAuthenticated à false', () => {
    const authStore = useAuthStore()

    expect(authStore.user).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
  })

  test('login enregistre user et active isAuthenticated', () => {
    const authStore = useAuthStore()

    authStore.login({
      email: 'test@institution.ma'
    })

    expect(authStore.user).toEqual({
      email: 'test@institution.ma'
    })
    expect(authStore.isAuthenticated).toBe(true)
  })

  test('logout supprime user et désactive isAuthenticated', () => {
    const authStore = useAuthStore()

    authStore.login({
      email: 'test@institution.ma'
    })

    authStore.logout()

    expect(authStore.user).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
  })
})