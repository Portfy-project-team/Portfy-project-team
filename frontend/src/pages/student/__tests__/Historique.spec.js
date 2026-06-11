import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Historique from '../Historique.vue'

vi.mock('../../../data/mockData.js', () => ({
  historyItems: [
    {
      id: 1,
      action: 'Validation projet',
      element: 'API REST',
      by: 'Pr. Benali',
      date: '10/06/2026',
      status: 'Validé',
      iconColor: 'green'
    },
    {
      id: 2,
      action: 'Refus attestation',
      element: 'Hackathon',
      by: 'Administration',
      date: '09/06/2026',
      status: 'Refusé',
      iconColor: 'orange'
    },
    {
      id: 3,
      action: 'Modification profil',
      element: 'Profil étudiant',
      by: 'Ahmed Alami',
      date: '08/06/2026',
      status: 'Modifié',
      iconColor: 'blue'
    },
    {
      id: 4,
      action: 'Correction demandée',
      element: 'Projet web',
      by: 'Pr. Karim',
      date: '07/06/2026',
      status: 'Correction demandée',
      iconColor: 'yellow'
    }
  ]
}))

const mountPage = () => {
  return mount(Historique, {
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

describe('Historique.vue', () => {
  test('affiche le titre de la page historique', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Historique')
    expect(wrapper.text()).toContain('Historique des validations')
    expect(wrapper.text()).toContain('Toutes les actions effectuees sur votre compte')
  })

  test('affiche les colonnes du tableau', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('ACTION')
    expect(wrapper.text()).toContain('ELEMENT')
    expect(wrapper.text()).toContain('PAR')
    expect(wrapper.text()).toContain('DATE')
    expect(wrapper.text()).toContain('STATUT')
  })

  test('affiche tous les elements par defaut', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Validation projet')
    expect(wrapper.text()).toContain('Refus attestation')
    expect(wrapper.text()).toContain('Modification profil')
    expect(wrapper.text()).toContain('Correction demandée')
  })

  test('filtre les validations', async () => {
    const wrapper = mountPage()

    const validationButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Validations')

    await validationButton.trigger('click')

    expect(wrapper.text()).toContain('Validation projet')
    expect(wrapper.text()).not.toContain('Refus attestation')
    expect(wrapper.text()).not.toContain('Modification profil')
  })

  test('filtre les refus', async () => {
    const wrapper = mountPage()

    const refusButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Refus')

    await refusButton.trigger('click')

    expect(wrapper.text()).toContain('Refus attestation')
    expect(wrapper.text()).not.toContain('Validation projet')
    expect(wrapper.text()).not.toContain('Modification profil')
  })

  test('filtre les modifications', async () => {
    const wrapper = mountPage()

    const modifButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Modifications')

    await modifButton.trigger('click')

    expect(wrapper.text()).toContain('Modification profil')
    expect(wrapper.text()).not.toContain('Validation projet')
    expect(wrapper.text()).not.toContain('Refus attestation')
  })

  test('applique les classes de status correctes', () => {
    const wrapper = mountPage()

    const statusPills = wrapper.findAll('.status-pill')
    const classes = statusPills.map((pill) => pill.classes())

    expect(classes[0]).toContain('status-valid')
    expect(classes[1]).toContain('status-rejected')
    expect(classes[2]).toContain('status-modified')
    expect(classes[3]).toContain('status-correction')
  })

  test('le bouton Tout affiche tous les elements apres filtrage', async () => {
    const wrapper = mountPage()

    const refusButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Refus')

    await refusButton.trigger('click')
    expect(wrapper.text()).toContain('Refus attestation')
    expect(wrapper.text()).not.toContain('Validation projet')

    const toutButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Tout')

    await toutButton.trigger('click')

    expect(wrapper.text()).toContain('Validation projet')
    expect(wrapper.text()).toContain('Refus attestation')
    expect(wrapper.text()).toContain('Modification profil')
    expect(wrapper.text()).toContain('Correction demandée')
  })
})