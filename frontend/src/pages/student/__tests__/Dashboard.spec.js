import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Dashboard from '../Dashboard.vue'

vi.mock('../../../data/mockData.js', () => ({
  dashboardStats: [
    {
      id: 1,
      title: 'Projets',
      value: 5,
      unit: '',
      subtitle: '+2 ce mois',
      color: 'blue',
      subtitleColor: 'green'
    },
    {
      id: 2,
      title: 'Stages',
      value: 2,
      unit: '',
      subtitle: '1 valide',
      color: 'orange',
      subtitleColor: 'blue'
    }
  ],
  scoreDetails: [
    {
      label: 'Projets validés',
      max: 20,
      percent: 4
    },
    {
      label: 'Stages',
      max: 20,
      percent: 3
    }
  ],
  recentActivities: [
    {
      id: 1,
      text: 'Projet API REST valide par Pr. Benali',
      time: 'Il y a 2 heures',
      color: 'green'
    },
    {
      id: 2,
      text: 'Badge Web Developer obtenu',
      time: 'Hier',
      color: 'orange'
    }
  ]
}))

const mountPage = () => {
  return mount(Dashboard, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title', 'userInitials'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        },
        StatCard: {
          props: ['title', 'value', 'unit', 'subtitle', 'color', 'subtitleColor'],
          template: `
            <div class="stat-card-stub">
              <span>{{ title }}</span>
              <strong>{{ value }}</strong>
              <small>{{ subtitle }}</small>
            </div>
          `
        }
      }
    }
  })
}

describe('Dashboard.vue', () => {
  test('affiche le titre dashboard', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Bonjour Ahmed')
    expect(wrapper.text()).toContain('Voici un apercu de votre activite et progression')
  })

  test('affiche les statistiques du dashboard', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Projets')
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('+2 ce mois')

    expect(wrapper.text()).toContain('Stages')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('1 valide')
  })

  test('affiche le score de credibilite', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Score de credibilite')
    expect(wrapper.text()).toContain('Detail de votre score sur 100')
    expect(wrapper.text()).toContain('82')
    expect(wrapper.text()).toContain('Avance')
  })

  test('affiche les details du score', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Projets validés')
    expect(wrapper.text()).toContain('Stages')
    expect(wrapper.text()).toContain('4%')
    expect(wrapper.text()).toContain('3%')
  })

  test('affiche les activites recentes', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Activite recente')
    expect(wrapper.text()).toContain('Vos dernieres actions')
    expect(wrapper.text()).toContain('Projet API REST valide par Pr. Benali')
    expect(wrapper.text()).toContain('Badge Web Developer obtenu')
  })

  test('formatActivity met certains mots en strong', () => {
    const wrapper = mountPage()

    const html = wrapper.html()

    expect(html).toContain('<strong>API REST</strong>')
    expect(html).toContain('<strong>Pr. Benali</strong>')
    expect(html).toContain('<strong>Web Developer</strong>')
  })
})