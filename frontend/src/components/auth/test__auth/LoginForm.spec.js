import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import Login from '../LoginForm.vue'
import { useAuthStore } from '../../../store/authStore'

const mocks = vi.hoisted(() => {
  return {
    push: vi.fn()
  }
})

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')

  return {
    ...actual,
    useRouter: () => ({
      push: mocks.push
    })
  }
})

function mountLogin() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(Login, {
    global: {
      plugins: [pinia],
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>'
        }
      }
    }
  })
}

describe('LoginForm.vue', () => {
  beforeEach(() => {
    mocks.push.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('affiche le formulaire de connexion', () => {
    const wrapper = mountLogin()

    expect(wrapper.text()).toContain('Bon retour')
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  test('affiche les erreurs si email et mot de passe sont vides', async () => {
    const wrapper = mountLogin()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain("L'adresse e-mail est requise.")
    expect(wrapper.text()).toContain('Le mot de passe est requis.')
    expect(mocks.push).not.toHaveBeenCalled()
  })

  test('affiche les erreurs si email invalide et mot de passe court', async () => {
    const wrapper = mountLogin()

    await wrapper.find('#email').setValue('email-invalide')
    await wrapper.find('#password').setValue('123')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Veuillez entrer une adresse e-mail valide.')
    expect(wrapper.text()).toContain('Le mot de passe doit comporter au moins 6 caractères.')
    expect(mocks.push).not.toHaveBeenCalled()
  })

  test('affiche et masque le mot de passe', async () => {
    const wrapper = mountLogin()

    expect(wrapper.find('#password').element.type).toBe('password')

    await wrapper.find('.toggle-password').trigger('click')

    expect(wrapper.find('#password').element.type).toBe('text')

    await wrapper.find('.toggle-password').trigger('click')

    expect(wrapper.find('#password').element.type).toBe('password')
  })

  test('connecte utilisateur et redirige vers dashboard si formulaire valide', async () => {
    vi.useFakeTimers()

    const wrapper = mountLogin()
    const authStore = useAuthStore()

    await wrapper.find('#email').setValue('test@institution.ma')
    await wrapper.find('#password').setValue('123456')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.find('.btn-submit').attributes('disabled')).toBeDefined()

    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()

    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.user).toEqual({
      email: 'test@institution.ma'
    })

    expect(mocks.push).toHaveBeenCalledWith('/dashboard')
    expect(wrapper.find('.btn-submit').attributes('disabled')).toBeUndefined()
  })
})