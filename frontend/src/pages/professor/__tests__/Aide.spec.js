import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Aide from '../Aide.vue'

vi.mock('../../../data/mockData.js', () => ({
  helpCards: [
    {
      title: 'Documentation',
      description: 'Guide complet d’utilisation',
      color: 'cream'
    },
    {
      title: 'Support',
      description: 'Contacter le support',
      color: 'blue'
    },
    {
      title: 'FAQ',
      description: 'Questions fréquentes',
      color: 'green'
    }
  ],
  questions: [
    {
      title: 'Comment consulter un portfolio ?',
      description: 'Ouvrez la page portfolios consultés.'
    },
    {
      title: 'Comment rédiger une recommandation ?',
      description: 'Cliquez sur ajouter une recommandation.'
    }
  ]
}))

const mountPage = () => {
  return mount(Aide, {
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

describe('Professor Aide.vue', () => {
  test('affiche la page aide', () => {
    const wrapper = mountPage()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Comment pouvons-nous vous aider ?')
    expect(wrapper.text()).toContain('Trouvez rapidement les reponses a vos questions')
  })

  test('affiche le champ de recherche', () => {
    const wrapper = mountPage()

    const input = wrapper.find('input')

    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe("Rechercher dans l'aide...")
  })

  test('affiche les cartes d aide', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('Support')
    expect(wrapper.text()).toContain('FAQ')
  })

  test('affiche les questions frequentes', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Questions frequentes')
    expect(wrapper.text()).toContain('Comment consulter un portfolio ?')
    expect(wrapper.text()).toContain('Comment rédiger une recommandation ?')
  })

  test('permet de saisir une recherche', async () => {
    const wrapper = mountPage()

    const input = wrapper.find('input')
    await input.setValue('portfolio')

    expect(input.element.value).toBe('portfolio')
  })
})