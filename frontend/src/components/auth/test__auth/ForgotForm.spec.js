import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import ForgotForm from '../ForgotForm.vue'

function mountForgotForm() {
  return mount(ForgotForm)
}

async function goToStep2(wrapper) {
  await wrapper.find('input[placeholder="votre.email@institution.ma"]').setValue('test@institution.ma')
  await wrapper.find('form').trigger('submit')
}

async function goToStep3(wrapper) {
  await goToStep2(wrapper)

  const otpInputs = wrapper.findAll('.otp-input')

  await otpInputs[0].setValue('1')
  await otpInputs[1].setValue('2')
  await otpInputs[2].setValue('3')
  await otpInputs[3].setValue('4')
  await otpInputs[4].setValue('5')
  await otpInputs[5].setValue('6')

  await wrapper.find('.btn-submit').trigger('click')
}

describe('ForgotForm.vue', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('affiche la première étape mot de passe oublié', () => {
    const wrapper = mountForgotForm()

    expect(wrapper.text()).toContain('Mot de passe oublié')
    expect(wrapper.text()).toContain('Adresse e-mail')
    expect(wrapper.text()).toContain('Envoyer le code')
  })

  test('affiche une erreur si email est vide', async () => {
    const wrapper = mountForgotForm()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Email obligatoire')
  })

  test('affiche une erreur si email est invalide', async () => {
    const wrapper = mountForgotForm()

    await wrapper.find('input[placeholder="votre.email@institution.ma"]').setValue('email-invalide')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Veuillez entrer un email valide')
  })

  test('passe à l’étape OTP si email est valide', async () => {
    const wrapper = mountForgotForm()

    await goToStep2(wrapper)

    expect(wrapper.text()).toContain('Vérification OTP')
    expect(wrapper.findAll('.otp-input')).toHaveLength(6)
  })

  test('revient à l’étape précédente depuis OTP', async () => {
    const wrapper = mountForgotForm()

    await goToStep2(wrapper)
    await wrapper.find('.back-login').trigger('click')

    expect(wrapper.text()).toContain('Mot de passe oublié')
  })

  test('affiche une erreur si le code OTP est incomplet', async () => {
    const wrapper = mountForgotForm()

    await goToStep2(wrapper)

    const otpInputs = wrapper.findAll('.otp-input')
    await otpInputs[0].setValue('1')
    await otpInputs[1].setValue('2')

    await wrapper.find('.btn-submit').trigger('click')

    expect(wrapper.text()).toContain('Veuillez entrer le code complet')
  })

  test('passe à l’étape nouveau mot de passe si OTP est complet', async () => {
    const wrapper = mountForgotForm()

    await goToStep3(wrapper)

    expect(wrapper.text()).toContain('Nouveau mot de passe')
    expect(wrapper.text()).toContain('Confirmer le mot de passe')
  })

  test('affiche les erreurs si les mots de passe sont vides', async () => {
    const wrapper = mountForgotForm()

    await goToStep3(wrapper)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Nouveau mot de passe obligatoire')
    expect(wrapper.text()).toContain('Veuillez confirmer le mot de passe')
  })

  test('affiche les erreurs si mot de passe court et confirmation différente', async () => {
    const wrapper = mountForgotForm()

    await goToStep3(wrapper)

    await wrapper.find('input[placeholder="Min. 8 caractères"]').setValue('123')
    await wrapper.find('input[placeholder="Retapez votre mot de passe"]').setValue('12345678')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Le mot de passe doit contenir au moins 8 caractères')
    expect(wrapper.text()).toContain('Les mots de passe ne sont pas identiques')
  })

  test('affiche le message succès si le nouveau mot de passe est valide', async () => {
    const wrapper = mountForgotForm()

    await goToStep3(wrapper)

    await wrapper.find('input[placeholder="Min. 8 caractères"]').setValue('12345678')
    await wrapper.find('input[placeholder="Retapez votre mot de passe"]').setValue('12345678')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Mot de passe changé')
    expect(wrapper.text()).toContain('Votre mot de passe a été modifié avec succès')
  })
})