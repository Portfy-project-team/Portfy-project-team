import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import PublicPortfolio from '../PublicPortfolio.vue'

const mocks = vi.hoisted(() => ({
  routeParams: {
    slug: 'ahmed-alami'
  }
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: mocks.routeParams
  })
}))

vi.mock('../../../data/mockData.js', () => ({
  portfolioData: {
    profile: {
      initials: 'AA',
      name: 'Ahmed Alami',
      title: 'Developpeur Web Junior',
      school: 'ENSA Tanger',
      about: 'Etudiant passionne par le developpement web.'
    },
    validatedProjects: [
      {
        id: 1,
        title: 'Projet Portfolio',
        meta: 'Projet academique valide',
        tags: ['Vue.js', 'Node.js']
      }
    ],
    badges: [
      {
        label: 'Web Developer',
        color: 'yellow'
      },
      {
        label: 'DevOps Beginner',
        color: 'green'
      }
    ]
  },
  networkStudents: [
    {
      id: 1,
      initials: 'SB',
      name: 'Sara Bouaziz',
      level: 'Avance',
      field: 'Genie Informatique',
      school: 'ENSA Tanger',
      year: '1ere annee',
      badges: ['Data Science', 'AI Beginner']
    },
    {
      id: 2,
      initials: 'OM',
      name: 'Omar Mansouri',
      level: 'Intermediaire',
      field: 'Cybersecurite',
      school: 'ENSA Tetouan',
      year: '2eme annee',
      badges: ['Security Aware']
    }
  ]
}))

describe('PublicPortfolio.vue', () => {
  beforeEach(() => {
    mocks.routeParams.slug = 'ahmed-alami'
  })

  test('affiche le portfolio public par defaut Ahmed Alami', () => {
    const wrapper = mount(PublicPortfolio)

    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Developpeur Web Junior')
    expect(wrapper.text()).toContain('ENSA Tanger')
    expect(wrapper.text()).toContain('Etudiant passionne par le developpement web.')
  })

  test('affiche les sections principales', () => {
    const wrapper = mount(PublicPortfolio)

    expect(wrapper.text()).toContain('A propos')
    expect(wrapper.text()).toContain('Projets valides')
    expect(wrapper.text()).toContain('Badges obtenus')
  })

  test('affiche les projets valides du portfolio par defaut', () => {
    const wrapper = mount(PublicPortfolio)

    expect(wrapper.text()).toContain('Projet Portfolio')
    expect(wrapper.text()).toContain('Projet academique valide')
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('Node.js')
  })

  test('affiche les badges du portfolio par defaut', () => {
    const wrapper = mount(PublicPortfolio)

    expect(wrapper.text()).toContain('Web Developer')
    expect(wrapper.text()).toContain('DevOps Beginner')
  })

  test('affiche un portfolio etudiant depuis le slug de la route', () => {
    mocks.routeParams.slug = 'sara-bouaziz'

    const wrapper = mount(PublicPortfolio)

    expect(wrapper.text()).toContain('Sara Bouaziz')
    expect(wrapper.text()).toContain('Avance - Genie Informatique')
    expect(wrapper.text()).toContain('ENSA Tanger - 1ere annee')
    expect(wrapper.text()).toContain('Portfolio academique')
    expect(wrapper.text()).toContain('Data Science')
    expect(wrapper.text()).toContain('AI Beginner')
  })

  test('affiche les initiales de l etudiant', () => {
    mocks.routeParams.slug = 'sara-bouaziz'

    const wrapper = mount(PublicPortfolio)

    expect(wrapper.find('.avatar').text()).toBe('SB')
  })
})