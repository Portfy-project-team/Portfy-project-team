import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Projects from '../Projects.vue'

vi.mock('../../../data/mockData.js', () => ({
  projects: [
    {
      id: 1,
      title: 'Portfolio Web',
      type: 'Projet academique',
      status: 'Valide',
      description: 'Plateforme portfolio.',
      correction: '',
      tags: ['Vue.js', 'CSS'],
      date: '10/06/2026',
      supervisor: 'Pr. Benali'
    },
    {
      id: 2,
      title: 'Application Stage',
      type: 'Projet stage',
      status: 'En attente',
      description: 'Application de gestion.',
      correction: '',
      tags: ['Laravel', 'MySQL'],
      date: '09/06/2026',
      supervisor: 'Pr. Karim'
    },
    {
      id: 3,
      title: 'Projet DevOps',
      type: 'Projet personnel',
      status: 'Correction demandee',
      description: 'Pipeline CI/CD.',
      correction: 'Ajouter documentation.',
      tags: ['Docker', 'GitHub Actions'],
      date: '08/06/2026',
      supervisor: ''
    }
  ]
}))

const mountPage = () => {
  return mount(Projects, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title', 'userInitials'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        },
        StatusBadge: {
          props: ['status'],
          template: '<span class="status-badge-stub">{{ status }}</span>'
        },
        ProjectModal: {
          props: ['projectToEdit'],
          emits: ['close', 'save'],
          template: `
            <div class="project-modal-stub">
              <p>Project Modal</p>
              <p class="edit-title">{{ projectToEdit ? projectToEdit.title : 'new' }}</p>

              <button class="close-modal" @click="$emit('close')">
                Close
              </button>

              <button
                class="save-modal"
                @click="$emit('save', {
                  id: projectToEdit ? projectToEdit.id : 4,
                  title: projectToEdit ? 'Portfolio Web Modifie' : 'Nouveau Projet',
                  type: 'Projet academique',
                  status: 'En attente',
                  description: 'Description test',
                  correction: '',
                  tags: ['Vue.js'],
                  date: '12/06/2026',
                  supervisor: 'Pr. Test'
                })"
              >
                Save
              </button>
            </div>
          `
        }
      }
    }
  })
}

describe('Projects.vue', () => {
  test('affiche le titre de la page projets', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Mes projets')
    expect(wrapper.text()).toContain('Gerez vos projets academiques et personnels')
  })

  test('affiche la liste des projets', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Portfolio Web')
    expect(wrapper.text()).toContain('Application Stage')
    expect(wrapper.text()).toContain('Projet DevOps')
  })

  test('affiche les filtres avec compteurs', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Tous (3)')
    expect(wrapper.text()).toContain('Valides (1)')
    expect(wrapper.text()).toContain('En attente (1)')
    expect(wrapper.text()).toContain('Correction (1)')
  })

  test('filtre les projets valides', async () => {
    const wrapper = mountPage()

    const validButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text().includes('Valides'))

    await validButton.trigger('click')

    expect(wrapper.text()).toContain('Portfolio Web')
    expect(wrapper.text()).not.toContain('Application Stage')
    expect(wrapper.text()).not.toContain('Projet DevOps')
  })

  test('filtre les projets en attente', async () => {
    const wrapper = mountPage()

    const attenteButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text().includes('En attente'))

    await attenteButton.trigger('click')

    expect(wrapper.text()).toContain('Application Stage')
    expect(wrapper.text()).not.toContain('Portfolio Web')
    expect(wrapper.text()).not.toContain('Projet DevOps')
  })

  test('affiche correction box pour projet avec correction demandee', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Ajouter documentation.')
    expect(wrapper.find('.correction-box').exists()).toBe(true)
  })

  test('ouvre le modal nouveau projet', async () => {
    const wrapper = mountPage()

    expect(wrapper.find('.project-modal-stub').exists()).toBe(false)

    await wrapper.find('.primary-btn').trigger('click')

    expect(wrapper.find('.project-modal-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('new')
  })

  test('ajoute un nouveau projet apres save', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Nouveau Projet')
    expect(wrapper.text()).toContain('Tous (4)')
  })

  test('ouvre le modal modification projet', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.edit-btn')[0].trigger('click')

    expect(wrapper.find('.project-modal-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('Portfolio Web')
  })

  test('modifie un projet apres save', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.edit-btn')[0].trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Portfolio Web Modifie')
  })
})