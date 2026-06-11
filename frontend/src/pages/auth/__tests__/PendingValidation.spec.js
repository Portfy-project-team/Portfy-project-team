// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import PendingValidation from '../PendingValidation.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))

describe('PendingValidation.vue', () => {
  beforeEach(() => {
    push.mockClear()
  })

  test('affiche le message compte en attente de validation', () => {
    const wrapper = mount(PendingValidation)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Compte en attente de validation')
    expect(wrapper.text()).toContain('Votre dossier a bien été reçu')
    expect(wrapper.text()).toContain('24 à 48h')
    expect(wrapper.text()).toContain('Vous recevrez un e-mail dès que votre compte sera validé')
  })

  test('affiche l icone attente', () => {
    const wrapper = mount(PendingValidation)

    expect(wrapper.find('.pending-icon').exists()).toBe(true)
    expect(wrapper.find('.pending-icon').text()).toBe('⏳')
  })

  test('affiche le bouton retour à la connexion', () => {
    const wrapper = mount(PendingValidation)

    const button = wrapper.find('.btn-back-login')

    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Retour à la connexion')
  })

  test('redirige vers login au clic sur retour à la connexion', async () => {
    const wrapper = mount(PendingValidation)

    await wrapper.find('.btn-back-login').trigger('click')

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/login')
  })
})