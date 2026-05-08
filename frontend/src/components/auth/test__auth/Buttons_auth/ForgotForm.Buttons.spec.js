import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import ForgotForm from '../../ForgotForm.vue'

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

async function goToSuccess(wrapper) {
  await goToStep3(wrapper)

  await wrapper.find('input[placeholder="Min. 8 caractères"]').setValue('12345678')
  await wrapper.find('input[placeholder="Retapez votre mot de passe"]').setValue('12345678')

  await wrapper.find('form').trigger('submit')
}

describe('ForgotForm buttons and links', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('bouton Retour à la connexion existe dans step 1', () => {
    const wrapper = mountForgotForm()

    const backButton = wrapper.find('.back-login')

    expect(backButton.exists()).toBe(true)
    expect(backButton.text()).toContain('Retour à la connexion')
  })

  test('bouton Retour à la connexion déclenche goToLogin dans step 1', async () => {
    const wrapper = mountForgotForm()

    await wrapper.find('.back-login').trigger('click')

    expect(console.log).toHaveBeenCalledWith('Retour à la connexion')
  })

  test('lien Se connecter existe dans footer step 1', () => {
    const wrapper = mountForgotForm()

    const loginLink = wrapper.find('.forgot-footer a')

    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toContain('Se connecter')
    expect(loginLink.attributes('href')).toBe('#')
  })

  test('bouton Envoyer le code existe dans step 1', () => {
    const wrapper = mountForgotForm()

    const submitButton = wrapper.find('.btn-submit')

    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toContain('Envoyer le code')
  })

  test('bouton Envoyer le code affiche erreur si email vide', async () => {
    const wrapper = mountForgotForm()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Email obligatoire')
  })

  test('bouton Envoyer le code passe vers OTP si email valide', async () => {
    const wrapper = mountForgotForm()

    await wrapper.find('input[placeholder="votre.email@institution.ma"]').setValue('test@institution.ma')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Vérification OTP')
    expect(wrapper.find('.btn-submit').text()).toContain('Vérifier le code')
  })

  test('bouton Étape précédente revient de OTP vers email', async () => {
    const wrapper = mountForgotForm()

    await goToStep2(wrapper)

    expect(wrapper.text()).toContain('Vérification OTP')
    expect(wrapper.find('.back-login').text()).toContain('Étape précédente')

    await wrapper.find('.back-login').trigger('click')

    expect(wrapper.text()).toContain('Mot de passe oublié')
    expect(wrapper.find('.btn-submit').text()).toContain('Envoyer le code')
  })

  test('bouton Renvoyer existe dans step OTP', async () => {
    const wrapper = mountForgotForm()

    await goToStep2(wrapper)

    const resendButton = wrapper.find('.otp-info button')

    expect(resendButton.exists()).toBe(true)
    expect(resendButton.text()).toContain('Renvoyer')
  })

  test('bouton Vérifier le code affiche erreur si OTP incomplet', async () => {
    const wrapper = mountForgotForm()

    await goToStep2(wrapper)

    const otpInputs = wrapper.findAll('.otp-input')

    await otpInputs[0].setValue('1')
    await otpInputs[1].setValue('2')

    expect(wrapper.find('.btn-submit').text()).toContain('Vérifier le code')

    await wrapper.find('.btn-submit').trigger('click')

    expect(wrapper.text()).toContain('Veuillez entrer le code complet')
  })

  test('bouton Vérifier le code passe vers nouveau mot de passe si OTP complet', async () => {
    const wrapper = mountForgotForm()

    await goToStep3(wrapper)

    expect(wrapper.text()).toContain('Nouveau mot de passe')
    expect(wrapper.find('.btn-submit').text()).toContain('Réinitialiser le mot de passe')
  })

  test('bouton Étape précédente revient de nouveau mot de passe vers OTP', async () => {
    const wrapper = mountForgotForm()

    await goToStep3(wrapper)

    expect(wrapper.text()).toContain('Nouveau mot de passe')
    expect(wrapper.find('.back-login').text()).toContain('Étape précédente')

    await wrapper.find('.back-login').trigger('click')

    expect(wrapper.text()).toContain('Vérification OTP')
    expect(wrapper.find('.btn-submit').text()).toContain('Vérifier le code')
  })

  test('bouton Réinitialiser affiche erreurs si mots de passe vides', async () => {
    const wrapper = mountForgotForm()

    await goToStep3(wrapper)

    expect(wrapper.find('.btn-submit').text()).toContain('Réinitialiser le mot de passe')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Nouveau mot de passe obligatoire')
    expect(wrapper.text()).toContain('Veuillez confirmer le mot de passe')
  })

  test('bouton Réinitialiser passe au succès si mots de passe valides', async () => {
    const wrapper = mountForgotForm()

    await goToSuccess(wrapper)

    expect(wrapper.text()).toContain('Mot de passe changé')
    expect(wrapper.text()).toContain('Votre mot de passe a été modifié avec succès')
  })

  test('bouton Retour à la connexion existe dans step succès', async () => {
    const wrapper = mountForgotForm()

    await goToSuccess(wrapper)

    const successButton = wrapper.find('.success-btn')

    expect(successButton.exists()).toBe(true)
    expect(successButton.text()).toContain('Retour à la connexion')
  })

  test('bouton Retour à la connexion du succès déclenche goToLogin', async () => {
    const wrapper = mountForgotForm()

    await goToSuccess(wrapper)

    await wrapper.find('.success-btn').trigger('click')

    expect(console.log).toHaveBeenCalledWith('Retour à la connexion')
  })
})