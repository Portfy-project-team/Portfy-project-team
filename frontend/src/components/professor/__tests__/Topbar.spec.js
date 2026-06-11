import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Topbar from '../Topbar.vue'

vi.mock('lucide-vue-next', () => {
  const Icon = {
    template: '<span class="icon-stub"></span>'
  }

  return {
    Search: Icon,
    Bell: Icon,
    Check: Icon,
    X: Icon,
    MessageCircle: Icon,
    Eye: Icon,
    Folder: Icon,
    BellRing: Icon
  }
})

const mountTopbar = (props = {}) => {
  return mount(Topbar, {
    props
  })
}

describe('Professor Topbar.vue', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('affiche le titre par défaut', () => {
    const wrapper = mountTopbar()

    expect(wrapper.text()).toContain('Dashboard')
  })

  test('affiche le titre passé en props', () => {
    const wrapper = mountTopbar({
      title: 'Dashboard Professeur'
    })

    expect(wrapper.text()).toContain('Dashboard Professeur')
  })

  test('affiche les initiales utilisateur par défaut', () => {
    const wrapper = mountTopbar()

    expect(wrapper.find('.profile-btn').text()).toBe('AA')
  })

  test('affiche les initiales passées en props', () => {
    const wrapper = mountTopbar({
      userInitials: 'MG'
    })

    expect(wrapper.find('.profile-btn').text()).toBe('MG')
  })

  test('affiche la barre de recherche', () => {
    const wrapper = mountTopbar()

    const input = wrapper.find('input')

    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Rechercher')
  })

  test('affiche le bouton notification avec le nombre non lu', () => {
    const wrapper = mountTopbar()

    expect(wrapper.find('.notif-btn').exists()).toBe(true)
    expect(wrapper.find('.notif-badge').exists()).toBe(true)
    expect(wrapper.find('.notif-badge').text()).toBe('2')
  })

  test('ouvre le dropdown notifications au clic sur la cloche', async () => {
    const wrapper = mountTopbar()

    expect(wrapper.find('.notif-dropdown').exists()).toBe(false)

    await wrapper.find('.notif-btn').trigger('click')

    expect(wrapper.find('.notif-dropdown').exists()).toBe(true)
    expect(wrapper.text()).toContain('Notifications')
    expect(wrapper.text()).toContain('Sara Benali a posté un nouveau commentaire.')
    expect(wrapper.text()).toContain('Youssef Khalil a consulté votre recommandation.')
  })

  test('marque une notification comme lue au clic', async () => {
    const wrapper = mountTopbar()

    await wrapper.find('.notif-btn').trigger('click')

    expect(wrapper.find('.notif-badge').text()).toBe('2')

    await wrapper.findAll('.notif-item')[0].trigger('click')

    expect(wrapper.find('.notif-badge').text()).toBe('1')
  })

  test('marque toutes les notifications comme lues', async () => {
    const wrapper = mountTopbar()

    await wrapper.find('.notif-btn').trigger('click')

    expect(wrapper.find('.notif-badge').text()).toBe('2')

    await wrapper.find('.mark-all-btn').trigger('click')

    expect(wrapper.find('.notif-badge').exists()).toBe(false)
    expect(wrapper.find('.mark-all-btn').exists()).toBe(false)
  })

  test('supprime une notification avec le bouton dismiss', async () => {
    const wrapper = mountTopbar()

    await wrapper.find('.notif-btn').trigger('click')

    expect(wrapper.findAll('.notif-item')).toHaveLength(4)

    await wrapper.findAll('.dismiss-btn')[0].trigger('click')

    expect(wrapper.findAll('.notif-item')).toHaveLength(3)
    expect(wrapper.text()).not.toContain('Sara Benali a posté un nouveau commentaire.')
  })

  test('affiche message aucune notification si toutes sont supprimées', async () => {
    const wrapper = mountTopbar()

    await wrapper.find('.notif-btn').trigger('click')

    while (wrapper.find('.dismiss-btn').exists()) {
      await wrapper.find('.dismiss-btn').trigger('click')
    }

    expect(wrapper.findAll('.notif-item')).toHaveLength(0)
    expect(wrapper.text()).toContain('Aucune notification')
  })
})