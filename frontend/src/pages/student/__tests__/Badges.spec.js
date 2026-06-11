import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Badges from '../Badges.vue'

vi.mock('../../../data/mockData.js', () => ({
  obtainedBadges: [
    {
      title: 'Web Developer',
      subtitle: 'Plusieurs projets web validés',
      color: 'gold',
      date: '10/06/2026',
      locked: false
    },
    {
      title: 'DevOps Beginner',
      subtitle: 'Projet avec Docker',
      color: 'green',
      date: '11/06/2026',
      locked: false
    },
    {
      title: 'Full Stack',
      subtitle: 'Encore en progression',
      color: 'blue',
      locked: true,
      progress: '60%',
      progressValue: 60
    }
  ],
  lockedBadges: [
    {
      title: 'Security Aware',
      subtitle: 'Projet avec bonnes pratiques sécurité'
    },
    {
      title: 'AI / Data',
      subtitle: 'Projet en data ou IA'
    }
  ]
}))

const mountPage = () => {
  return mount(Badges, {
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

describe('Badges.vue', () => {
  test('affiche le titre de la page badges', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Badges')
    expect(wrapper.text()).toContain('Badges de competences')
  })

  test('calcule et affiche le nombre de badges débloqués', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('2 badges debloque sur 5 disponibles')
  })

  test('affiche le niveau actuel', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Niveau actuel : Avance')
    expect(wrapper.text()).toContain('Plus que 2 badges pour atteindre le niveau Expert')
  })

  test('affiche les badges obtenus', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Badges obtenus (2)')
    expect(wrapper.text()).toContain('Web Developer')
    expect(wrapper.text()).toContain('DevOps Beginner')
  })

  test('affiche les badges verrouillés dans la première section', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Full Stack')
    expect(wrapper.text()).toContain('60%')
  })

  test('affiche les badges à débloquer', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('A debloquer (2)')
    expect(wrapper.text()).toContain('Security Aware')
    expect(wrapper.text()).toContain('AI / Data')
  })

  test('affiche les dates des badges obtenus', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('10/06/2026')
    expect(wrapper.text()).toContain('11/06/2026')
  })
})