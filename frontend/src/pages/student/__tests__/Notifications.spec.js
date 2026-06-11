import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Notifications from '../Notifications.vue'

vi.mock('../../../data/mockData.js', () => ({
  notifications: [
    {
      id: 1,
      title: 'Projet valide',
      message: 'Votre projet a ete valide.',
      time: 'Il y a 1h',
      unread: true,
      category: 'Projets',
      color: 'green'
    },
    {
      id: 2,
      title: 'Nouveau commentaire',
      message: 'Vous avez recu un commentaire.',
      time: 'Hier',
      unread: true,
      category: 'Commentaires',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Badge obtenu',
      message: 'Vous avez obtenu un badge.',
      time: '2 jours',
      unread: false,
      category: 'Badges',
      color: 'orange'
    }
  ]
}))

const mountPage = () => {
  return mount(Notifications, {
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

describe('Notifications.vue', () => {
  test('affiche le titre et le nombre de notifications', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Toutes les notifications')
    expect(wrapper.text()).toContain('3 notifications - 2 non lues')
  })

  test('affiche la liste des notifications', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Projet valide')
    expect(wrapper.text()).toContain('Nouveau commentaire')
    expect(wrapper.text()).toContain('Badge obtenu')
  })

  test('affiche les filtres avec compteurs', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Toutes')
    expect(wrapper.text()).toContain('Non lues')
    expect(wrapper.text()).toContain('Projets')
    expect(wrapper.text()).toContain('Commentaires')
    expect(wrapper.text()).toContain('Badges')
  })

  test('filtre les notifications non lues', async () => {
    const wrapper = mountPage()

    const nonLuesBtn = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text().includes('Non lues'))

    await nonLuesBtn.trigger('click')

    expect(wrapper.text()).toContain('Projet valide')
    expect(wrapper.text()).toContain('Nouveau commentaire')
    expect(wrapper.text()).not.toContain('Badge obtenu')
  })

  test('filtre les notifications projets', async () => {
    const wrapper = mountPage()

    const projetsBtn = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text().includes('Projets'))

    await projetsBtn.trigger('click')

    expect(wrapper.text()).toContain('Projet valide')
    expect(wrapper.text()).not.toContain('Nouveau commentaire')
    expect(wrapper.text()).not.toContain('Badge obtenu')
  })

  test('marque toutes les notifications comme lues', async () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('3 notifications - 2 non lues')
    expect(wrapper.findAll('.unread-dot')).toHaveLength(2)

    await wrapper.find('.read-btn').trigger('click')

    expect(wrapper.text()).toContain('3 notifications - 0 non lues')
    expect(wrapper.findAll('.unread-dot')).toHaveLength(0)
  })
})