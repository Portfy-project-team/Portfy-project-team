import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Parametres from '../Parametres.vue'

const mountPage = () => {
  return mount(Parametres, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title', 'userInitials'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        }
      }
    }
  })
}

describe('Professor Parametres.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true)
  })

  test('affiche la page parametres', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Parametres du compte')
    expect(wrapper.text()).toContain('Gerez votre profil et vos preferences')
    expect(wrapper.text()).toContain('Informations personnelles')
  })

  test('enregistre les informations personnelles valides', async () => {
    const wrapper = mountPage()

    const textInputs = wrapper.findAll('input[type="text"]')
    const emailInput = wrapper.find('input[type="email"]')

    await textInputs[0].setValue('Mohamed')
    await textInputs[1].setValue('Ghailani')
    await emailInput.setValue('prof@test.com')

    const saveButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Enregistrer les modifications')

    await saveButton.trigger('click')

    expect(localStorage.getItem('studentPersonalInfo')).toContain('Mohamed')
    expect(wrapper.text()).toContain('Modifications enregistrees avec succes')
  })

  test('affiche une alerte si email invalide', async () => {
    const wrapper = mountPage()

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('email-invalide')

    const saveButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Enregistrer les modifications')

    await saveButton.trigger('click')

    expect(window.alert).toHaveBeenCalledWith('Email invalide.')
  })

  test('ouvre et ferme le modal mot de passe', async () => {
    const wrapper = mountPage()

    const passwordButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Changer le mot de passe')

    await passwordButton.trigger('click')

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Changer le mot de passe')

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  test('change le mot de passe avec champs valides', async () => {
    const wrapper = mountPage()

    const passwordButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Changer le mot de passe')

    await passwordButton.trigger('click')

    const passwordInputs = wrapper.findAll('.modal-card input[type="password"]')

    await passwordInputs[0].setValue('oldpassword')
    await passwordInputs[1].setValue('newpassword123')
    await passwordInputs[2].setValue('newpassword123')

    const savePasswordButton = wrapper
      .findAll('.modal-card button')
      .find((button) => button.text() === 'Enregistrer')

    await savePasswordButton.trigger('click')

    expect(window.alert).toHaveBeenCalledWith('Mot de passe change avec succes.')
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  test('active 2FA', async () => {
    const wrapper = mountPage()

    const twoFactorButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Activer 2FA')

    await twoFactorButton.trigger('click')

    expect(window.alert).toHaveBeenCalledWith('2FA active avec succes.')
    expect(wrapper.text()).toContain('Desactiver 2FA')
  })

  test('desactive le portfolio', async () => {
    const wrapper = mountPage()

    const disableButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Desactiver le portfolio')

    await disableButton.trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith('Portfolio desactive.')
    expect(wrapper.text()).toContain('Portfolio desactive')
  })
})