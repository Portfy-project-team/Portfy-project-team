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

describe('Parametres.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true)
  })

  test('affiche le titre de la page parametres', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Parametres du compte')
    expect(wrapper.text()).toContain('Gerez votre profil et vos preferences')
  })

  test('affiche les informations personnelles par defaut', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Informations personnelles')
    expect(wrapper.find('input[type="email"]').element.value).toBe('ahmed@ensat.ac.ma')
    expect(wrapper.text()).toContain('Bio / Presentation')
  })

  test('enregistre les informations personnelles valides', async () => {
    const wrapper = mountPage()

    const textInputs = wrapper.findAll('input[type="text"]')
    const emailInput = wrapper.find('input[type="email"]')

    await textInputs[0].setValue('Youssef')
    await textInputs[1].setValue('Zailachi')
    await emailInput.setValue('youssef@test.com')

    const saveButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Enregistrer les modifications')

    await saveButton.trigger('click')

    expect(localStorage.getItem('studentPersonalInfo')).toContain('Youssef')
    expect(wrapper.text()).toContain('Modifications enregistrees avec succes')
  })

  test('affiche alerte si email invalide', async () => {
    const wrapper = mountPage()

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('email-invalide')

    const saveButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Enregistrer les modifications')

    await saveButton.trigger('click')

    expect(window.alert).toHaveBeenCalledWith('Email invalide.')
  })

  test('toggle notification change la classe active', async () => {
    const wrapper = mountPage()

    const firstSwitch = wrapper.find('.switch')

    expect(firstSwitch.classes()).toContain('active')

    await firstSwitch.trigger('click')

    expect(firstSwitch.classes()).not.toContain('active')
    expect(localStorage.getItem('studentNotifications')).toContain('projectValidation')
  })

  test('ouvre et ferme le modal mot de passe', async () => {
    const wrapper = mountPage()

    const passwordButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Changer le mot de passe')

    await passwordButton.trigger('click')

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Choisissez un nouveau mot de passe securise')

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  test('change password avec champs valides', async () => {
    const wrapper = mountPage()

    const passwordButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Changer le mot de passe')

    await passwordButton.trigger('click')

    const passwordInputs = wrapper.findAll('.modal-card input[type="password"]')

    await passwordInputs[0].setValue('oldpassword')
    await passwordInputs[1].setValue('newpassword123')
    await passwordInputs[2].setValue('newpassword123')

    await wrapper.find('.modal-card .primary-btn').trigger('click')

    expect(window.alert).toHaveBeenCalledWith('Mot de passe change avec succes.')
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  test('active le 2FA', async () => {
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