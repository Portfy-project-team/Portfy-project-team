// @vitest-environment jsdom

import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import LoginForm from '../LoginForm.vue'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  login: vi.fn(),
  axiosPost: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mocks.push
  })
}))

vi.mock('axios', () => ({
  default: {
    post: mocks.axiosPost
  }
}))

vi.mock('../../../store/authStore', () => ({
  useAuthStore: () => ({
    login: mocks.login
  })
}))

const mountLogin = () => {
  return mount(LoginForm, {
    global: {
      stubs: {
        RouterLink: {
          props: ['to'],
          template: '<a class="router-link-stub" :href="to"><slot /></a>'
        }
      }
    }
  })
}

describe('LoginForm.vue', () => {
  beforeEach(() => {
    mocks.push.mockClear()
    mocks.login.mockClear()
    mocks.axiosPost.mockReset()
  })

  test('affiche la page login', () => {
    const wrapper = mountLogin()

    expect(wrapper.text()).toContain('Portfy')
    expect(wrapper.text()).toContain('Bon retour')
    expect(wrapper.text()).toContain('Connectez-vous à votre espace Portfy.')
    expect(wrapper.text()).toContain('Se connecter')
  })

  test('affiche les liens register et forgot password', () => {
    const wrapper = mountLogin()

    const links = wrapper.findAll('.router-link-stub')
    const hrefs = links.map((link) => link.attributes('href'))

    expect(hrefs).toContain('/register')
    expect(hrefs).toContain('/forgot-password')
  })

  test('affiche erreurs si email et password sont vides', async () => {
    const wrapper = mountLogin()

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain("L'adresse e-mail est requise.")
    expect(wrapper.text()).toContain('Le mot de passe est requis.')
    expect(mocks.axiosPost).not.toHaveBeenCalled()
  })

  test('affiche erreurs si email invalide et mot de passe court', async () => {
    const wrapper = mountLogin()

    await wrapper.find('#email').setValue('test.com')
    await wrapper.find('#password').setValue('123')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Veuillez entrer une adresse e-mail valide.')
    expect(wrapper.text()).toContain('Le mot de passe doit comporter au moins 6 caractères.')
    expect(mocks.axiosPost).not.toHaveBeenCalled()
  })

  test('toggle password change le type input', async () => {
    const wrapper = mountLogin()

    const passwordInput = wrapper.find('#password')

    expect(passwordInput.attributes('type')).toBe('password')

    await wrapper.find('.toggle-password').trigger('click')

    expect(wrapper.find('#password').attributes('type')).toBe('text')
  })

  test('login success appelle API, store login et redirect dashboard', async () => {
    mocks.axiosPost.mockResolvedValue({
      data: {
        user: {
          id: 1,
          name: 'Ahmed',
          role: 'STUDENT'
        }
      }
    })

    const wrapper = mountLogin()

    await wrapper.find('#email').setValue('ahmed@test.com')
    await wrapper.find('#password').setValue('123456')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mocks.axiosPost).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/login',
      {
        email: 'ahmed@test.com',
        password: '123456'
      },
      {
        withCredentials: true
      }
    )

    expect(mocks.login).toHaveBeenCalledWith({
      id: 1,
      name: 'Ahmed',
      role: 'STUDENT'
    })

    expect(mocks.push).toHaveBeenCalledWith('/dashboard')
  })

  test('login failed affiche message erreur serveur', async () => {
    mocks.axiosPost.mockRejectedValue(new Error('invalid credentials'))

    const wrapper = mountLogin()

    await wrapper.find('#email').setValue('ahmed@test.com')
    await wrapper.find('#password').setValue('123456')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Identifiants incorrects.')
  })
})