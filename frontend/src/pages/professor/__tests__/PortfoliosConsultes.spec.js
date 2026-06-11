import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import PortfoliosConsultes from '../PortfoliosConsultes.vue'

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
    Eye: Icon,
    Star: Icon,
    MessageCircle: Icon,
    Search: Icon,
    Bookmark: Icon,
    TrendingUp: Icon,
    X: Icon
  }
})

const mountPage = () => {
  return mount(PortfoliosConsultes, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        }
      }
    }
  })
}

describe('Professor PortfoliosConsultes.vue', () => {
  beforeEach(() => {
    push.mockClear()
  })

  test('affiche la page portfolios consultes', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Portfolios consultés')
    expect(wrapper.text()).toContain('Historique des portfolios que vous avez visités')
  })

  test('affiche les statistiques', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Total consultés')
    expect(wrapper.text()).toContain('6')
    expect(wrapper.text()).toContain('Recommandés')
    expect(wrapper.text()).toContain('Commentés')
  })

  test('affiche les portfolios', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Omar Mellouki')
    expect(wrapper.text()).toContain('Sara Benali')
    expect(wrapper.text()).toContain('Ahmed Alami')
  })

  test('filtre les portfolios recommandes', async () => {
    const wrapper = mountPage()

    const recommendedButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Recommandés')

    await recommendedButton.trigger('click')

    expect(wrapper.text()).toContain('Sara Benali')
    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Leila Moussaoui')
    expect(wrapper.text()).not.toContain('Omar Mellouki')
  })

  test('filtre les portfolios commentes', async () => {
    const wrapper = mountPage()

    const commentedButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Commentés')

    await commentedButton.trigger('click')

    expect(wrapper.text()).toContain('Sara Benali')
    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Youssef Khalil')
    expect(wrapper.text()).not.toContain('Omar Mellouki')
  })

  test('recherche un portfolio par nom', async () => {
    const wrapper = mountPage()

    const input = wrapper.find('input')
    await input.setValue('Sara')

    expect(wrapper.text()).toContain('Sara Benali')
    expect(wrapper.text()).not.toContain('Omar Mellouki')
  })

  test('ouvre le drawer detail au clic sur une card', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.portfolio-card')[0].trigger('click')

    expect(wrapper.find('.drawer-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nombre de visites')
    expect(wrapper.text()).toContain('Rédiger une recommandation')
  })

  test('ferme le drawer avec bouton close', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.portfolio-card')[0].trigger('click')
    expect(wrapper.find('.drawer-overlay').exists()).toBe(true)

    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.find('.drawer-overlay').exists()).toBe(false)
  })

  test('toggle favori sur un portfolio', async () => {
    const wrapper = mountPage()

    const bookmarkButton = wrapper.findAll('.bookmark-btn')[0]

    expect(bookmarkButton.classes()).not.toContain('active')

    await bookmarkButton.trigger('click')

    expect(bookmarkButton.classes()).toContain('active')
  })

  test('redirige vers recommandations depuis le drawer', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.portfolio-card')[0].trigger('click')
    await wrapper.find('.btn-primary').trigger('click')

    expect(push).toHaveBeenCalledWith('/professor/recommandations')
  })
})