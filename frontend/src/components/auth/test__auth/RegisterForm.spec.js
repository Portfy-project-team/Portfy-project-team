import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import RegisterForm from '../RegisterForm.vue'

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

describe('RegisterForm.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('affiche la première étape du formulaire inscription', () => {
    const wrapper = mountRegisterForm()

    expect(wrapper.text()).toContain('Créez votre compte')
    expect(wrapper.text()).toContain('Nom')
    expect(wrapper.text()).toContain('Prénom')
    expect(wrapper.text()).toContain('Adresse e-mail')
    expect(wrapper.text()).toContain('Mot de passe')
  })

  test('affiche les erreurs si les champs de la première étape sont vides', async () => {
    const wrapper = mountRegisterForm()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Nom obligatoire')
    expect(wrapper.text()).toContain('Prénom obligatoire')
    expect(wrapper.text()).toContain('Email obligatoire')
    expect(wrapper.text()).toContain('Mot de passe obligatoire')
    expect(wrapper.text()).toContain('Confirmation obligatoire')
    expect(wrapper.text()).toContain('Vous devez accepter les conditions')
  })

  test('affiche les erreurs si email invalide et mots de passe différents', async () => {
    const wrapper = mountRegisterForm()

    await wrapper.find('input[placeholder="Votre nom"]').setValue('Zailachi')
    await wrapper.find('input[placeholder="Votre prénom"]').setValue('Youssef')
    await wrapper.find('input[placeholder="votre.email@institution.ma"]').setValue('email-invalide')
    await wrapper.find('input[placeholder="Mot de passe"]').setValue('12345678')
    await wrapper.find('input[placeholder="Confirmer le mot de passe"]').setValue('87654321')
    await wrapper.find('#terms').setValue(true)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Veuillez entrer un email valide')
    expect(wrapper.text()).toContain('Les mots de passe ne sont pas identiques')
  })

  test('passe à la deuxième étape si la première étape est valide', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Votre formation')
    expect(wrapper.text()).toContain('Type de formation')
    expect(wrapper.text()).toContain('Établissement')
  })

  test('affiche les erreurs si les champs de formation sont vides', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Type de formation obligatoire')
    expect(wrapper.text()).toContain('Établissement obligatoire')
    expect(wrapper.text()).toContain('Filière obligatoire')
    expect(wrapper.text()).toContain('Niveau d’études obligatoire')
    expect(wrapper.text()).toContain('Année d’entrée obligatoire')
    expect(wrapper.text()).toContain('Diplôme prévu obligatoire')
  })

  test('passe à la troisième étape si la formation est valide', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Votre profil')
    expect(wrapper.text()).toContain('Bio courte')
    expect(wrapper.text()).toContain('Compétences clés')
    expect(wrapper.text()).toContain('Disponibilité')
  })

  test('ajoute une compétence puis la supprime', async () => {
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

  test('affiche les erreurs si le profil est vide', async () => {
    const wrapper = mountRegisterForm()

    await fillStep1(wrapper)
    await wrapper.find('form').trigger('submit')

    await fillStep2(wrapper)
    await wrapper.find('form').trigger('submit')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Bio obligatoire')
    expect(wrapper.text()).toContain('Ajoutez au moins une compétence')
    expect(wrapper.text()).toContain('Disponibilité obligatoire')
  })

  test('crée le compte si toutes les étapes sont valides', async () => {
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

    await wrapper.find('form').trigger('submit')

    expect(window.alert).toHaveBeenCalledWith('Compte créé avec succès')
  })
})