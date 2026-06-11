import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Commentaires from '../Commentaires.vue'

vi.mock('../../../data/mockData.js', () => ({
  comments: [
    {
      id: 1,
      name: 'Ahmed Alami',
      initials: 'AA',
      role: 'Etudiant',
      roleClass: 'role-student',
      avatarColor: 'avatar-blue',
      meta: 'Portfolio public',
      text: 'Merci professeur pour votre retour.',
      status: 'En attente'
    },
    {
      id: 2,
      name: 'Sara Benali',
      initials: 'SB',
      role: 'Etudiante',
      roleClass: 'role-student',
      avatarColor: 'avatar-yellow',
      meta: 'Projet Data',
      text: 'Commentaire deja publie.',
      status: 'Validee'
    },
    {
      id: 3,
      name: 'Omar Mellouki',
      initials: 'OM',
      role: 'Etudiant',
      roleClass: 'role-student',
      avatarColor: 'avatar-green',
      meta: 'Projet Backend',
      text: 'Commentaire refuse.',
      status: 'Refusee'
    }
  ]
}))

const mountPage = () => {
  return mount(Commentaires, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title', 'userInitials'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        },
        StatusBadge: {
          props: ['status'],
          template: '<span class="status-badge-stub">{{ status }}</span>'
        }
      }
    }
  })
}

describe('Professor Commentaires.vue', () => {
  test('affiche le titre de la page commentaires', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Commentaires recus')
    expect(wrapper.text()).toContain('Moderez les commentaires avant leur publication')
  })

  test('affiche les commentaires en attente et publies', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('En attente de validation (1)')
    expect(wrapper.text()).toContain('Commentaires publies (1)')
    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Sara Benali')
  })

  test('accepte un commentaire en attente', async () => {
    const wrapper = mountPage()

    await wrapper.find('.accept-btn').trigger('click')

    expect(wrapper.text()).toContain('En attente de validation (0)')
    expect(wrapper.text()).toContain('Commentaires publies (2)')
  })

  test('refuse un commentaire en attente', async () => {
    const wrapper = mountPage()

    await wrapper.find('.refuse-btn').trigger('click')

    expect(wrapper.text()).toContain('En attente de validation (0)')
    expect(wrapper.text()).toContain('Commentaires publies (1)')
  })

  test('affiche les boutons refuser et accepter', () => {
    const wrapper = mountPage()

    expect(wrapper.find('.refuse-btn').exists()).toBe(true)
    expect(wrapper.find('.accept-btn').exists()).toBe(true)
  })
})