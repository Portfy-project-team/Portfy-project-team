import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Aide from '../Aide.vue'

vi.mock('../../../data/mockData.js', () => ({
  helpCards: [
    {
      title: 'Guide utilisateur',
      description: 'Apprendre à utiliser la plateforme',
      color: 'cream'
    },
    {
      title: 'Support technique',
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
      title: 'Comment ajouter un projet ?',
      description: 'Cliquez sur le bouton ajouter projet.'
    },
    {
      title: 'Comment générer le portfolio ?',
      description: 'Depuis la page portfolio.'
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

describe('Aide.vue', () => {
  test('affiche le titre de la page aide', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Aide & Support')
    expect(wrapper.text()).toContain('Comment pouvons-nous vous aider ?')
    expect(wrapper.text()).toContain('Trouvez rapidement les reponses a vos questions')
  })

  test('affiche le champ de recherche', () => {
    const wrapper = mountPage()

    const input = wrapper.find('input')

    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe("Rechercher dans l'aide...")
  })

  test('affiche les cartes d’aide', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Guide utilisateur')
    expect(wrapper.text()).toContain('Support technique')
    expect(wrapper.text()).toContain('FAQ')
  })

  test('affiche les descriptions des cartes', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Apprendre à utiliser la plateforme')
    expect(wrapper.text()).toContain('Contacter le support')
    expect(wrapper.text()).toContain('Questions fréquentes')
  })

  test('affiche les questions fréquentes', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Questions frequentes')
    expect(wrapper.text()).toContain('Comment ajouter un projet ?')
    expect(wrapper.text()).toContain('Comment générer le portfolio ?')
  })

  test('permet de saisir une recherche', async () => {
    const wrapper = mountPage()

    const input = wrapper.find('input')
    await input.setValue('portfolio')

    expect(input.element.value).toBe('portfolio')
  })
})