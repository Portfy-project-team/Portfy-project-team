import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Formations from '../Formations.vue'

vi.mock('../../../data/mockData.js', () => ({
  formations: [
    {
      id: 1,
      title: 'Vue.js Avancé',
      provider: 'OpenClassrooms',
      status: 'Validé',
      progress: 100,
      progressColor: 'progress-green',
      iconColor: 'icon-blue',
      label: 'Date obtention',
      date: '10/06/2026',
      tags: ['Vue.js', 'Frontend'],
      links: ['Certificat'],
      certificateLink: 'https://example.com/certificat-vue'
    },
    {
      id: 2,
      title: 'Docker Basics',
      provider: 'Udemy',
      status: 'En cours',
      progress: 60,
      progressColor: 'progress-orange',
      iconColor: 'icon-orange',
      label: 'Debut',
      date: '01/06/2026',
      tags: ['Docker', 'DevOps'],
      links: ['Certificat'],
      certificateLink: ''
    }
  ]
}))

const mountPage = () => {
  return mount(Formations, {
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
        FormationModal: {
          props: ['formationToEdit'],
          emits: ['close', 'save'],
          template: `
            <div class="formation-modal-stub">
              <p>Formation Modal</p>
              <p class="edit-title">{{ formationToEdit ? formationToEdit.title : 'new' }}</p>
              <button class="close-modal" @click="$emit('close')">Close</button>
              <button
                class="save-modal"
                @click="$emit('save', {
                  id: formationToEdit ? formationToEdit.id : 3,
                  title: formationToEdit ? 'Vue.js Modifié' : 'Nouvelle formation',
                  provider: 'Coursera',
                  status: 'En attente',
                  progress: 20,
                  progressColor: 'progress-blue',
                  iconColor: 'icon-blue',
                  label: 'Debut',
                  date: '12/06/2026',
                  tags: ['Web'],
                  links: ['Certificat'],
                  certificateLink: ''
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

describe('Formations.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'open').mockImplementation(() => {})
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  test('affiche le titre de la page formations', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Formations & Certifications')
    expect(wrapper.text()).toContain('Mes formations')
    expect(wrapper.text()).toContain('Cours en ligne, certifications et formations continues')
  })

  test('affiche la liste des formations', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Vue.js Avancé')
    expect(wrapper.text()).toContain('OpenClassrooms')
    expect(wrapper.text()).toContain('Docker Basics')
    expect(wrapper.text()).toContain('Udemy')
  })

  test('affiche progression, tags et statuts', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Progression')
    expect(wrapper.text()).toContain('100%')
    expect(wrapper.text()).toContain('60%')
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('Frontend')
    expect(wrapper.text()).toContain('Docker')
    expect(wrapper.text()).toContain('DevOps')
    expect(wrapper.text()).toContain('Validé')
    expect(wrapper.text()).toContain('En cours')
  })

  test('ouvre le modal pour ajouter une formation', async () => {
    const wrapper = mountPage()

    expect(wrapper.find('.formation-modal-stub').exists()).toBe(false)

    await wrapper.find('.primary-btn').trigger('click')

    expect(wrapper.find('.formation-modal-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('new')
  })

  test('ajoute une nouvelle formation apres save', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Nouvelle formation')
    expect(wrapper.text()).toContain('Coursera')
  })

  test('ouvre le modal pour modifier une formation', async () => {
    const wrapper = mountPage()

    const editButton = wrapper.findAll('.edit-btn')[0]
    await editButton.trigger('click')

    expect(wrapper.find('.formation-modal-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('Vue.js Avancé')
  })

  test('modifie une formation apres save', async () => {
    const wrapper = mountPage()

    const editButton = wrapper.findAll('.edit-btn')[0]
    await editButton.trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Vue.js Modifié')
  })

  test('ouvre le certificat si le lien existe', async () => {
    const wrapper = mountPage()

    const certificatButtons = wrapper.findAll('.link-btn')
    await certificatButtons[0].trigger('click')

    expect(window.open).toHaveBeenCalledWith(
      'https://example.com/certificat-vue',
      '_blank'
    )
  })

  test('affiche une alerte si aucun certificat existe', async () => {
    const wrapper = mountPage()

    const certificatButtons = wrapper.findAll('.link-btn')
    await certificatButtons[1].trigger('click')

    expect(window.alert).toHaveBeenCalledWith(
      'Aucun certificat disponible pour cette formation pour le moment.'
    )
  })
})