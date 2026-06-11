import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Reseau from '../Reseau.vue'

const mocks = vi.hoisted(() => ({
  resolve: vi.fn((path) => ({
    href: path
  }))
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    resolve: mocks.resolve
  })
}))

vi.mock('../../../data/mockData.js', () => ({
  networkStudents: [
    {
      id: 1,
      initials: 'SB',
      name: 'Sara Bouaziz',
      year: '1ere annee',
      field: 'Genie Informatique',
      school: 'ENSA Tanger',
      score: 88,
      level: 'Avance',
      levelClass: 'level-advanced',
      avatarColor: 'avatar-blue',
      badges: ['Web Developer', 'Data Science']
    },
    {
      id: 2,
      initials: 'OM',
      name: 'Omar Mansouri',
      year: '2eme annee',
      field: 'Cybersecurite',
      school: 'ENSA Tetouan',
      score: 74,
      level: 'Intermediaire',
      levelClass: 'level-medium',
      avatarColor: 'avatar-yellow',
      badges: ['Security Aware']
    }
  ]
}))

const mountPage = () => {
  return mount(Reseau, {
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

describe('Reseau.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'open').mockImplementation(() => {})
    mocks.resolve.mockClear()
  })

  test('affiche le titre de la page reseau', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Reseau etudiants')
    expect(wrapper.text()).toContain('Decouvrez les portfolios des autres etudiants de votre reseau')
  })

  test('affiche les filtres de recherche', () => {
    const wrapper = mountPage()

    const input = wrapper.find('input')
    const selects = wrapper.findAll('select')

    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Rechercher par nom, badge ou projet...')
    expect(selects).toHaveLength(3)
    expect(wrapper.text()).toContain('Toutes les filieres')
    expect(wrapper.text()).toContain('Tous les badges')
    expect(wrapper.text()).toContain('Tous les scores')
  })

  test('affiche les colonnes du tableau', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('ETUDIANT')
    expect(wrapper.text()).toContain('FILIERE')
    expect(wrapper.text()).toContain('ETABLISSEMENT')
    expect(wrapper.text()).toContain('SCORE')
    expect(wrapper.text()).toContain('BADGES')
    expect(wrapper.text()).toContain('ACTIONS')
  })

  test('affiche la liste des etudiants du reseau', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Sara Bouaziz')
    expect(wrapper.text()).toContain('Omar Mansouri')
    expect(wrapper.text()).toContain('Genie Informatique')
    expect(wrapper.text()).toContain('Cybersecurite')
    expect(wrapper.text()).toContain('ENSA Tanger')
    expect(wrapper.text()).toContain('ENSA Tetouan')
  })

  test('affiche les scores, niveaux et badges', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('88')
    expect(wrapper.text()).toContain('74')
    expect(wrapper.text()).toContain('Avance')
    expect(wrapper.text()).toContain('Intermediaire')
    expect(wrapper.text()).toContain('Web Developer')
    expect(wrapper.text()).toContain('Data Science')
    expect(wrapper.text()).toContain('Security Aware')
  })

  test('ouvre le portfolio public dans un nouvel onglet', async () => {
    const wrapper = mountPage()

    const firstPortfolioButton = wrapper.findAll('.portfolio-btn')[0]

    await firstPortfolioButton.trigger('click')

    expect(mocks.resolve).toHaveBeenCalledWith('/portfolio/sara-bouaziz')
    expect(window.open).toHaveBeenCalledWith('/portfolio/sara-bouaziz', '_blank')
  })

  test('affiche un bouton voir portfolio pour chaque etudiant', () => {
    const wrapper = mountPage()

    const buttons = wrapper.findAll('.portfolio-btn')

    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('Voir portfolio')
    expect(buttons[1].text()).toBe('Voir portfolio')
  })
})