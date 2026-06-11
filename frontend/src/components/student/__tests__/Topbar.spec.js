import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Topbar from '../Topbar.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))

describe('Topbar.vue', () => {
  beforeEach(() => {
    push.mockClear()
  })

  test('affiche le titre passé en props', () => {
    const wrapper = mount(Topbar, {
      props: {
        title: 'Dashboard Étudiant'
      }
    })

    expect(wrapper.text()).toContain('Dashboard Étudiant')
  })

  test('affiche les initiales utilisateur', () => {
    const wrapper = mount(Topbar, {
      props: {
        userInitials: 'YZ'
      }
    })

    expect(wrapper.find('.profile-btn').text()).toBe('YZ')
  })

  test('affiche les valeurs par défaut', () => {
    const wrapper = mount(Topbar)

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.find('.profile-btn').text()).toBe('AA')
  })

  test('affiche la barre de recherche', () => {
    const wrapper = mount(Topbar)

    const input = wrapper.find('input')

    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Rechercher')
  })

  test('affiche le bouton notifications', () => {
    const wrapper = mount(Topbar)

    expect(wrapper.find('.notif-btn').exists()).toBe(true)
    expect(wrapper.find('.notif-btn').attributes('title')).toBe('Notifications')
  })
})