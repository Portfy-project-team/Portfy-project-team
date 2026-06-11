import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Sidebar from '../Sidebar.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))

vi.mock('lucide-vue-next', () => {
  const Icon = {
    template: '<span class="icon-stub"></span>'
  }

  return {
    Home: Icon,
    Eye: Icon,
    Star: Icon,
    MessageCircle: Icon,
    Settings: Icon,
    HelpCircle: Icon,
    LogOut: Icon,
    ChevronLeft: Icon,
    ChevronRight: Icon
  }
})

const mountSidebar = () => {
  return mount(Sidebar, {
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

describe('Professor Sidebar.vue', () => {
  beforeEach(() => {
    push.mockClear()
  })

  test('affiche la sidebar ouverte avec logo et profil professeur', () => {
    const wrapper = mountSidebar()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Portfy')
    expect(wrapper.text()).toContain('M. Ghailani')
    expect(wrapper.text()).toContain('Professeur · ENSAT')
    expect(wrapper.text()).toContain('Compte vérifié')
  })

  test('affiche les initiales du professeur', () => {
    const wrapper = mountSidebar()

    expect(wrapper.find('.avatar').text()).toBe('MG')
  })

  test('affiche les liens du menu professeur', () => {
    const wrapper = mountSidebar()

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Portfolios consultés')
    expect(wrapper.text()).toContain('Recommandations')
    expect(wrapper.text()).toContain('Commentaires')
    expect(wrapper.text()).toContain('Paramètres')
    expect(wrapper.text()).toContain('Aide & Support')
  })

  test('contient les routes correctes du professeur', () => {
    const wrapper = mountSidebar()

    const links = wrapper.findAll('.router-link-stub')
    const hrefs = links.map((link) => link.attributes('href'))

    expect(hrefs).toContain('/professor/dashboard')
    expect(hrefs).toContain('/professor/portfolios-consultes')
    expect(hrefs).toContain('/professor/recommandations')
    expect(hrefs).toContain('/professor/commentaires')
    expect(hrefs).toContain('/professor/parametres')
    expect(hrefs).toContain('/professor/aide')
  })

  test('affiche le badge 3 sur commentaires', () => {
    const wrapper = mountSidebar()

    expect(wrapper.find('.badge').exists()).toBe(true)
    expect(wrapper.find('.badge').text()).toBe('3')
  })

  test('ferme la sidebar au clic sur le bouton toggle', async () => {
    const wrapper = mountSidebar()

    expect(wrapper.classes()).not.toContain('closed')
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('M. Ghailani')

    await wrapper.find('.toggle-btn').trigger('click')

    expect(wrapper.classes()).toContain('closed')
    expect(wrapper.text()).not.toContain('Dashboard')
    expect(wrapper.text()).not.toContain('M. Ghailani')
    expect(wrapper.text()).not.toContain('Compte vérifié')
  })

  test('redirige vers login au clic sur déconnexion', async () => {
    const wrapper = mountSidebar()

    await wrapper.find('.logout-btn').trigger('click')

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/login')
  })
})