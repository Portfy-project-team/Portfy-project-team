import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import RegisterForm from '../../RegisterForm.vue'

function mountRegisterForm() {
  return mount(RegisterForm)
}

async function fillStep1(wrapper) {
  await wrapper.find('input[placeholder="Votre nom"]').setValue('Zailachi')
  await wrapper.find('input[placeholder="Votre prénom"]').setValue('Youssef')
  await wrapper.find('input[placeholder="votre.email@institution.ma"]').setValue('test@institution.ma')
  await wrapper.find('input[placeholder="Mot de passe"]').setValue('12345678')
  await wrapper.find('input[placeholder="Confirmer le mot de passe"]').setValue('12345678')
  await wrapper.find('#terms').setValue(true)
}

async function fillStep2(wrapper) {
  await wrapper.findAll('.formation-card')[0].trigger('click')
  await wrapper.find('input[placeholder="Ex : Ensa, Tanger"]').setValue('ENSA Tanger')
  await wrapper.find('input[placeholder="Ex : Informatique"]').setValue('Informatique')
  await wrapper.find('select').setValue('Bac+3')

  const yearInputs = wrapper.findAll('input[placeholder="Année"]')
  await yearInputs[0].setValue('2022')
  await yearInputs[1].setValue('2025')
}

describe('RegisterForm buttons and links', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('affiche les boutons Connexion et Inscription en haut', () => {
    const wrapper = mountRegisterForm()

    const tabs = wrapper.findAll('.tabs .tab')

    expect(tabs).toHaveLength(2)
    expect(tabs[0].text()).toContain('Connexion')
    expect(tabs[1].text()).toContain('Inscription')
  })

  test('le bouton Inscription est actif', () => {
    const wrapper = mountRegisterForm()

    const tabs = wrapper.findAll('.tabs .tab')

    expect(tabs[1].classes()).toContain('active')
  })

  test('affiche conditions d’utilisation et politique de confidentialité', () => {
    const wrapper = mountRegisterForm()

    expect(wrapper.text()).toContain('conditions d’utilisation')
    expect(wrapper.text()).toContain('politique de confidentialité')
  })

  test('checkbox des conditions peut être cochée', async () => {
    const wrapper = mountRegisterForm()

    const checkbox = wrapper.find('#terms')

    await checkbox.setValue(true)

    expect(checkbox.element.checked).toBe(true)
  })

  test('affiche le lien Se connecter en bas du formulaire', () => {
    const wrapper = mountRegisterForm()

    const loginLink = wrapper.find('.inline-link')

    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toContain('Se connecter')
  })

  test('bouton Continuer passe de step 1 vers step 2', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)

    expect(wrapper.find('.btn-submit').text()).toContain('Continuer')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Votre formation')
  })

  test('bouton retour revient de step 2 vers step 1', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Votre formation')

    await wrapper.find('.btn-back').trigger('click')

    expect(wrapper.text()).toContain('Créez votre compte')
  })

  test('boutons formation sélectionnent un type de formation', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    const formationButtons = wrapper.findAll('.formation-card')

    expect(formationButtons).toHaveLength(3)

    await formationButtons[0].trigger('click')
    expect(formationButtons[0].classes()).toContain('selected')

    await formationButtons[1].trigger('click')
    expect(formationButtons[1].classes()).toContain('selected')

    await formationButtons[2].trigger('click')
    expect(formationButtons[2].classes()).toContain('selected')
  })

  test('bouton Continuer passe de step 2 vers step 3', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Votre profil')
  })

  test('bouton retour revient de step 3 vers step 2', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Votre profil')

    await wrapper.find('.btn-back').trigger('click')

    expect(wrapper.text()).toContain('Votre formation')
  })

  test('bouton Ajouter une photo existe', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.small-btn').exists()).toBe(true)
    expect(wrapper.find('.small-btn').text()).toContain('Ajouter une photo')
  })

  test('bouton plus ajoute une compétence', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    await wrapper.find('input[placeholder="Ajouter une compétence..."]').setValue('Vue.js')
    await wrapper.find('.add-skill-btn').trigger('click')

    expect(wrapper.text()).toContain('Vue.js')
  })

  test('bouton x supprime une compétence', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    await wrapper.find('input[placeholder="Ajouter une compétence..."]').setValue('Vue.js')
    await wrapper.find('.add-skill-btn').trigger('click')

    expect(wrapper.text()).toContain('Vue.js')

    await wrapper.find('.skill-tag button').trigger('click')

    expect(wrapper.text()).not.toContain('Vue.js')
  })

  test('boutons disponibilité sélectionnent une disponibilité', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    const availabilityButtons = wrapper.findAll('.availability-card')

    expect(availabilityButtons).toHaveLength(4)

    await availabilityButtons[0].trigger('click')
    expect(availabilityButtons[0].classes()).toContain('selected')

    await availabilityButtons[1].trigger('click')
    expect(availabilityButtons[1].classes()).toContain('selected')

    await availabilityButtons[2].trigger('click')
    expect(availabilityButtons[2].classes()).toContain('selected')

    await availabilityButtons[3].trigger('click')
    expect(availabilityButtons[3].classes()).toContain('selected')
  })

  test('bouton Créer mon compte valide la création du compte', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    await wrapper.find('.bio-textarea').setValue('Étudiant en informatique passionné par le développement web.')
    await wrapper.find('input[placeholder="Ajouter une compétence..."]').setValue('Vue.js')
    await wrapper.find('.add-skill-btn').trigger('click')
    await wrapper.findAll('.availability-card')[0].trigger('click')
    await wrapper.find('input[placeholder="votre-profil"]').setValue('youssef-zailachi')

    expect(wrapper.find('.btn-submit').text()).toContain('Créer mon compte')

    await wrapper.find('form').trigger('submit')

    expect(window.alert).toHaveBeenCalledWith('Compte créé avec succès')
  })
})