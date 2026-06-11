import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import Portfolio from '../Portfolio.vue'

const mocks = vi.hoisted(() => {
  const pdfSave = vi.fn()
  const pdfFrom = vi.fn(() => ({ save: pdfSave }))
  const pdfSet = vi.fn(() => ({ from: pdfFrom }))
  const html2pdfMock = vi.fn(() => ({ set: pdfSet }))

  return {
    pdfSave,
    pdfFrom,
    pdfSet,
    html2pdfMock
  }
})

vi.mock('html2pdf.js', () => ({
  default: mocks.html2pdfMock
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

vi.mock('../../../data/mockData.js', () => ({
  portfolioData: {
    objectives: ['Developpeur Web', 'DevOps', 'Data Science', 'Cybersecurite'],
    templates: ['Modern', 'Classic', 'Minimal'],
    visibility: ['Portfolio public', 'Projets valides uniquement'],
    profile: {
      initials: 'AA',
      name: 'Ahmed Alami',
      title: 'Developpeur Web Junior',
      school: 'ENSA Tanger',
      status: 'Certifie',
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
  }
}))

const mountPage = () => {
  return mount(Portfolio, {
    global: {
      stubs: {
        Sidebar: true,
        StatusBadge: {
          props: ['status'],
          template: '<span class="status-badge-stub">{{ status }}</span>'
        }
      }
    }
  })
}

describe('Portfolio.vue', () => {
  beforeEach(() => {
    localStorage.clear()

    vi.spyOn(window, 'open').mockImplementation(() => {})
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue()
      },
      configurable: true
    })

    mocks.html2pdfMock.mockClear()
    mocks.pdfSet.mockClear()
    mocks.pdfFrom.mockClear()
    mocks.pdfSave.mockClear()
  })

  test('affiche le titre de la page portfolio', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Mon Portfolio')
    expect(wrapper.text()).toContain('Editez et personnalisez votre portfolio professionnel')
  })

  test('affiche les objectifs professionnels', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Developpeur Web')
    expect(wrapper.text()).toContain('DevOps')
    expect(wrapper.text()).toContain('Data Science')
    expect(wrapper.text()).toContain('Cybersecurite')
  })

  test('change objectif actif au clic', async () => {
    const wrapper = mountPage()

    const devopsButton = wrapper
      .findAll('.objective-btn')
      .find((button) => button.text() === 'DevOps')

    await devopsButton.trigger('click')

    expect(devopsButton.classes()).toContain('active')
  })

  test('affiche les informations du profil', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Ahmed Alami')
    expect(wrapper.text()).toContain('Developpeur Web Junior')
    expect(wrapper.text()).toContain('ENSA Tanger')
    expect(wrapper.text()).toContain('Etudiant passionne par le developpement web.')
  })

  test('affiche projets valides et badges', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('PROJETS VALIDES (1)')
    expect(wrapper.text()).toContain('Projet Portfolio')
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('BADGES OBTENUS')
    expect(wrapper.text()).toContain('Web Developer')
  })

  test('change template actif', async () => {
    const wrapper = mountPage()

    const classicButton = wrapper
      .findAll('.template-btn')
      .find((button) => button.text() === 'Classic')

    await classicButton.trigger('click')

    expect(classicButton.classes()).toContain('active')
  })

  test('ouvre aperçu public', async () => {
    const wrapper = mountPage()

    await wrapper.find('.preview-btn').trigger('click')

    expect(window.open).toHaveBeenCalled()
  })

  test('copie le lien public', async () => {
    const wrapper = mountPage()

    await wrapper.find('.copy-btn').trigger('click')
    await nextTick()

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Lien copie')
  })

  test('exporte le portfolio en PDF', async () => {
    const wrapper = mountPage()

    await wrapper.find('.export-btn').trigger('click')

    expect(mocks.html2pdfMock).toHaveBeenCalled()
    expect(mocks.pdfSet).toHaveBeenCalled()
    expect(mocks.pdfFrom).toHaveBeenCalled()
    expect(mocks.pdfSave).toHaveBeenCalled()
  })
})