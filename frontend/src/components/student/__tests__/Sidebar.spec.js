import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Sidebar from '../Sidebar.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  }),
  RouterLink: {
    props: ['to'],
    template: '<a class="router-link-stub" :href="to"><slot /></a>'
  }
}))

describe('Sidebar.vue', () => {
  beforeEach(() => {
    push.mockClear()
  })

  test('affiche la sidebar ouverte avec logo, profil et score', () => {
    const wrapper = mount(Sidebar)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Portfy')
    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Étudiant · ENSAT')
    expect(wrapper.text()).toContain('Score:')
    expect(wrapper.text()).toContain('82/100')
  })

  test('affiche les liens principaux du menu étudiant', () => {
    const wrapper = mount(Sidebar)

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Projects')
    expect(wrapper.text()).toContain('Stages')
    expect(wrapper.text()).toContain('Portfolio')
    expect(wrapper.text()).toContain('Activités')
    expect(wrapper.text()).toContain('Formations')
    expect(wrapper.text()).toContain('Compétences')
    expect(wrapper.text()).toContain('Notifications')
    expect(wrapper.text()).toContain('Paramètres')
    expect(wrapper.text()).toContain('Aide & Support')
  })

  test('contient les routes correctes', () => {
    const wrapper = mount(Sidebar)

    const links = wrapper.findAll('.router-link-stub')
    const hrefs = links.map((link) => link.attributes('href'))

    expect(hrefs).toContain('/student/dashboard')
    expect(hrefs).toContain('/student/projects')
    expect(hrefs).toContain('/student/stages')
    expect(hrefs).toContain('/student/portfolio')
    expect(hrefs).toContain('/student/notifications')
    expect(hrefs).toContain('/student/parametres')
    expect(hrefs).toContain('/student/aide')
  })

  test('ferme la sidebar au clic sur le bouton toggle', async () => {
    const wrapper = mount(Sidebar)

    expect(wrapper.classes()).not.toContain('closed')
    expect(wrapper.text()).toContain('Dashboard')

    await wrapper.find('.toggle-btn').trigger('click')

    expect(wrapper.classes()).toContain('closed')
    expect(wrapper.text()).not.toContain('Dashboard')
    expect(wrapper.text()).not.toContain('Ahmed Alami')
  })

  test('redirige vers login au clic sur déconnexion', async () => {
    const wrapper = mount(Sidebar)

    await wrapper.find('.logout-btn').trigger('click')

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/login')
  })
})