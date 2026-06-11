// @vitest-environment jsdom

import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import ForgotForm from '../ForgotForm.vue'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  routeQuery: {},
  axiosPost: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mocks.push
  }),
  useRoute: () => ({
    query: mocks.routeQuery
  })
}))

vi.mock('axios', () => ({
  default: {
    post: mocks.axiosPost
  }
}))

const mountForgot = () => {
  return mount(ForgotForm)
}

describe('ForgotForm.vue', () => {
  beforeEach(() => {
    mocks.push.mockClear()
    mocks.axiosPost.mockReset()
    mocks.routeQuery = {}
  })

  test('affiche step 1 avec champ email', () => {
    const wrapper = mountForgot()

    expect(wrapper.text()).toContain('Retour à la connexion')
    expect(wrapper.text()).toContain('Adresse e-mail')
    expect(wrapper.text()).toContain('Envoyer le code')
  })

  test('retour connexion redirige vers login en step 1', async () => {
    const wrapper = mountForgot()

    await wrapper.find('.back-login').trigger('click')

    expect(mocks.push).toHaveBeenCalledWith('/login')
  })

  test('affiche erreur si email vide', async () => {
    const wrapper = mountForgot()

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Email obligatoire')
    expect(mocks.axiosPost).not.toHaveBeenCalled()
  })

  test('affiche erreur si email invalide', async () => {
    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test.com')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Veuillez entrer un email valide')
    expect(mocks.axiosPost).not.toHaveBeenCalled()
  })

  test('email valide appelle API et passe vers OTP step 2', async () => {
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('Ahmed@Test.Com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mocks.axiosPost).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/forgot-password',
      {
        email: 'ahmed@test.com'
      }
    )

    expect(wrapper.text()).toContain('Un code à 6 chiffres')
    expect(wrapper.findAll('.otp-input')).toHaveLength(6)
  })

  test('bouton étape précédente revient de step 2 vers step 1', async () => {
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Vérifier le code')

    await wrapper.find('.back-login').trigger('click')

    expect(wrapper.text()).toContain('Envoyer le code')
  })

  test('affiche erreur si OTP incomplet', async () => {
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    await wrapper.find('.btn-submit').trigger('click')

    expect(wrapper.text()).toContain('Veuillez entrer le code complet')
  })

  test('OTP complet passe vers step nouveau mot de passe', async () => {
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const otpInputs = wrapper.findAll('.otp-input')

    for (let i = 0; i < otpInputs.length; i++) {
      await otpInputs[i].setValue(String(i + 1))
    }

    await wrapper.find('.btn-submit').trigger('click')

    expect(wrapper.text()).toContain('Nouveau mot de passe')
    expect(wrapper.text()).toContain('Réinitialiser le mot de passe')
  })

  test('affiche erreurs si nouveaux mots de passe invalides', async () => {
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const otpInputs = wrapper.findAll('.otp-input')
    for (let i = 0; i < otpInputs.length; i++) {
      await otpInputs[i].setValue(String(i + 1))
    }

    await wrapper.find('.btn-submit').trigger('click')

    const passwordInputs = wrapper.findAll('input[type="password"]')

    await passwordInputs[0].setValue('123')
    await passwordInputs[1].setValue('456')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Le mot de passe doit contenir au moins 8 caractères')
    expect(wrapper.text()).toContain('Les mots de passe ne sont pas identiques')
  })

  test('affiche erreur si token manquant lors reset password', async () => {
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const otpInputs = wrapper.findAll('.otp-input')
    for (let i = 0; i < otpInputs.length; i++) {
      await otpInputs[i].setValue(String(i + 1))
    }

    await wrapper.find('.btn-submit').trigger('click')

    const passwordInputs = wrapper.findAll('input[type="password"]')

    await passwordInputs[0].setValue('Password123')
    await passwordInputs[1].setValue('Password123')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Token manquant. Utilisez le lien reçu par email.')
  })

  test('reset password success passe vers step 4', async () => {
    mocks.routeQuery.token = 'reset-token'
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const otpInputs = wrapper.findAll('.otp-input')
    for (let i = 0; i < otpInputs.length; i++) {
      await otpInputs[i].setValue(String(i + 1))
    }

    await wrapper.find('.btn-submit').trigger('click')

    const passwordInputs = wrapper.findAll('input[type="password"]')

    await passwordInputs[0].setValue('Password123')
    await passwordInputs[1].setValue('Password123')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mocks.axiosPost).toHaveBeenLastCalledWith(
      'http://localhost:3000/api/auth/reset-password',
      {
        token: 'reset-token',
        password: 'Password123'
      }
    )

    expect(wrapper.text()).toContain('Mot de passe changé !')
  })

  test('bouton success retourne vers login', async () => {
    mocks.routeQuery.token = 'reset-token'
    mocks.axiosPost.mockResolvedValue({ data: {} })

    const wrapper = mountForgot()

    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const otpInputs = wrapper.findAll('.otp-input')
    for (let i = 0; i < otpInputs.length; i++) {
      await otpInputs[i].setValue(String(i + 1))
    }

    await wrapper.find('.btn-submit').trigger('click')

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('Password123')
    await passwordInputs[1].setValue('Password123')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    await wrapper.find('.success-btn').trigger('click')

    expect(mocks.push).toHaveBeenCalledWith('/login')
  })
})