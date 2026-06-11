import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Commentaires from '../Commentaires.vue'

vi.mock('../../../data/mockData.js', () => ({
  comments: [
    {
      id: 1,
      name: 'Prof Ahmed',
      initials: 'PA',
      role: 'Professeur',
      roleClass: 'role-prof',
      avatarColor: 'avatar-yellow',
      meta: 'Projet Web',
      text: 'Très bon travail.',
      status: 'En attente'
    },
    {
      id: 2,
      name: 'Recruteur Sara',
      initials: 'RS',
      role: 'Professionnel',
      roleClass: 'role-pro',
      avatarColor: 'avatar-blue',
      meta: 'Portfolio public',
      text: 'Portfolio intéressant.',
      status: 'Validee'
    },
    {
      id: 3,
      name: 'Etudiant Omar',
      initials: 'EO',
      role: 'Etudiant',
      roleClass: 'role-student',
      avatarColor: 'avatar-pink',
      meta: 'Projet DevOps',
      text: 'Bon projet.',
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

describe('Commentaires.vue', () => {
  test('affiche le titre de la page commentaires', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Commentaires')
    expect(wrapper.text()).toContain('Commentaires recus')
    expect(wrapper.text()).toContain('Moderez les commentaires avant leur publication')
  })

  test('affiche les compteurs des commentaires', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('En attente de validation (1)')
    expect(wrapper.text()).toContain('Commentaires publies (1)')
  })

  test('affiche les commentaires en attente', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Prof Ahmed')
    expect(wrapper.text()).toContain('Très bon travail.')
    expect(wrapper.text()).toContain('En attente')
  })

  test('affiche les commentaires publiés', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Recruteur Sara')
    expect(wrapper.text()).toContain('Portfolio intéressant.')
    expect(wrapper.text()).toContain('Validee')
  })

  test('accepte un commentaire en attente', async () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('En attente de validation (1)')
    expect(wrapper.text()).toContain('Commentaires publies (1)')

    await wrapper.find('.accept-btn').trigger('click')

    expect(wrapper.text()).toContain('En attente de validation (0)')
    expect(wrapper.text()).toContain('Commentaires publies (2)')
  })

  test('refuse un commentaire en attente', async () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('En attente de validation (1)')
    expect(wrapper.text()).toContain('Commentaires publies (1)')

    await wrapper.find('.refuse-btn').trigger('click')

    expect(wrapper.text()).toContain('En attente de validation (0)')
    expect(wrapper.text()).toContain('Commentaires publies (1)')
  })

  test('affiche les boutons Refuser et Accepter pour les commentaires en attente', () => {
    const wrapper = mountPage()

    expect(wrapper.find('.refuse-btn').exists()).toBe(true)
    expect(wrapper.find('.accept-btn').exists()).toBe(true)
  })
})