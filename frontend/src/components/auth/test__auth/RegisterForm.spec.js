// @vitest-environment jsdom

import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import RegisterForm from '../RegisterForm.vue'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
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

const mountRegister = () => {
  return mount(RegisterForm, {
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

async function fillStep1(wrapper, role = 'STUDENT') {
  const inputs = wrapper.findAll('input')

  await inputs[0].setValue('Alami')
  await inputs[1].setValue('Ahmed')
  await inputs[2].setValue('ahmed@test.com')
  await inputs[3].setValue('Password@123')
  await inputs[4].setValue('Password@123')

  await wrapper.find('select').setValue(role)
  await wrapper.find('#terms').setChecked(true)
}

async function goToStudentStep2(wrapper) {
  await fillStep1(wrapper, 'STUDENT')
  await wrapper.find('form').trigger('submit.prevent')
}

async function fillStudentStep2(wrapper) {
  await wrapper.findAll('.formation-card')[1].trigger('click')

  await wrapper.find('input[type="text"]').setValue('ENSA Tanger')

  const selects = wrapper.findAll('select')

  await selects[0].setValue('Informatique')
  await selects[1].setValue('Cycle 1')
  await selects[2].setValue(String(new Date().getFullYear()))
  await selects[3].setValue(String(new Date().getFullYear() + 2))
}

async function goToStudentStep3(wrapper) {
  await goToStudentStep2(wrapper)
  await fillStudentStep2(wrapper)
  await wrapper.find('form').trigger('submit.prevent')
}

describe('RegisterForm.vue', () => {
  beforeEach(() => {
    mocks.push.mockClear()
    mocks.axiosPost.mockReset()

    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'console', 'get').mockReturnValue(console)
  })

  test('affiche step 1 inscription', () => {
    const wrapper = mountRegister()

    expect(wrapper.text()).toContain('Inscription')
    expect(wrapper.text()).toContain('Créer votre compte')
    expect(wrapper.text()).toContain('Nom')
    expect(wrapper.text()).toContain('Prénom')
    expect(wrapper.text()).toContain('Adresse e-mail')
  })

  test('bouton connexion redirige vers login', async () => {
    const wrapper = mountRegister()

    await wrapper.find('.tab').trigger('click')

    expect(mocks.push).toHaveBeenCalledWith('/login')
  })

  test('affiche erreurs si step 1 vide', async () => {
    const wrapper = mountRegister()

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Nom obligatoire')
    expect(wrapper.text()).toContain('Prénom obligatoire')
    expect(wrapper.text()).toContain('Email obligatoire')
    expect(wrapper.text()).toContain('Mot de passe obligatoire')
    expect(wrapper.text()).toContain('Confirmation obligatoire')
    expect(wrapper.text()).toContain('Choisissez un rôle')
    expect(wrapper.text()).toContain('Veuillez accepter les conditions')
  })

  test('affiche erreurs email invalide password faible et confirmation différente', async () => {
    const wrapper = mountRegister()

    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Alami')
    await inputs[1].setValue('Ahmed')
    await inputs[2].setValue('ahmed.com')
    await inputs[3].setValue('12345678')
    await inputs[4].setValue('87654321')

    await wrapper.find('select').setValue('STUDENT')
    await wrapper.find('#terms').setChecked(true)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Email invalide')
    expect(wrapper.text()).toContain('8-72 caractères avec une majuscule, un chiffre et un caractère spécial')
    expect(wrapper.text()).toContain('Les mots de passe ne correspondent pas')
  })

  test('step 1 valide passe vers step 2 étudiant', async () => {
    const wrapper = mountRegister()

    await goToStudentStep2(wrapper)

    expect(wrapper.text()).toContain('Profil étudiant')
    expect(wrapper.text()).toContain('Type de formation')
    expect(wrapper.text()).toContain('Établissement')
  })

  test('step 2 étudiant affiche erreurs si vide', async () => {
    const wrapper = mountRegister()

    await goToStudentStep2(wrapper)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Champ obligatoire')
  })

  test('step 2 étudiant valide passe vers step 3', async () => {
    const wrapper = mountRegister()

    await goToStudentStep3(wrapper)

    expect(wrapper.text()).toContain('Finalisez votre profil')
    expect(wrapper.text()).toContain('Bio courte')
    expect(wrapper.text()).toContain('Compétences clés')
    expect(wrapper.text()).toContain('Disponibilité')
  })

  test('ajoute et supprime une compétence', async () => {
    const wrapper = mountRegister()

    await goToStudentStep3(wrapper)

    const skillInput = wrapper.find('input[placeholder="Ajouter une compétence..."]')
    await skillInput.setValue('Vue.js')

    await wrapper.find('.add-skill-btn').trigger('click')

    expect(wrapper.text()).toContain('Vue.js')

    await wrapper.find('.skill-tag button').trigger('click')

    expect(wrapper.text()).not.toContain('Vue.js')
  })

  test('step 3 étudiant affiche erreurs si bio skills disponibilité vides', async () => {
    const wrapper = mountRegister()

    await goToStudentStep3(wrapper)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Bio obligatoire')
    expect(wrapper.text()).toContain('Ajoutez au moins une compétence')
    expect(wrapper.text()).toContain('Choisissez une disponibilité')
  })

  test('register étudiant success appelle API et redirige login', async () => {
    mocks.axiosPost.mockResolvedValue({
      status: 201,
      data: {
        message: 'Compte créé avec succès !'
      }
    })

    const wrapper = mountRegister()

    await goToStudentStep3(wrapper)

    await wrapper.find('textarea').setValue('Étudiant motivé par le développement web.')

    await wrapper.find('input[placeholder="Ajouter une compétence..."]').setValue('Vue.js')
    await wrapper.find('.add-skill-btn').trigger('click')

    await wrapper.findAll('.availability-card')[0].trigger('click')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mocks.axiosPost).toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith('Compte créé avec succès !')
    expect(mocks.push).toHaveBeenCalledWith('/login')
  })

  test('register étudiant failed affiche alerte erreur', async () => {
    mocks.axiosPost.mockRejectedValue({
      response: {
        data: {
          message: 'Email déjà utilisé'
        }
      }
    })

    const wrapper = mountRegister()

    await goToStudentStep3(wrapper)

    await wrapper.find('textarea').setValue('Étudiant motivé par le développement web.')

    await wrapper.find('input[placeholder="Ajouter une compétence..."]').setValue('Vue.js')
    await wrapper.find('.add-skill-btn').trigger('click')

    await wrapper.findAll('.availability-card')[0].trigger('click')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith('Email déjà utilisé')
  })
})