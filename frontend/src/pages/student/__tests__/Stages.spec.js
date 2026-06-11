import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Stages from '../Stages.vue'

vi.mock('../../../data/mockData.js', () => ({
  stages: [
    {
      id: 1,
      company: 'Tech Solutions',
      position: 'Stagiaire Developpeur Web',
      location: 'Tanger',
      period: 'Mai - Juin 2026',
      duration: '2 mois',
      status: 'Validé',
      iconColor: 'icon-blue',
      missions: [
        'Developpement frontend',
        'Integration API'
      ],
      technologies: ['Vue.js', 'Laravel', 'MySQL'],
      companySupervisor: 'M. Amine',
      academicSupervisor: 'Pr. Benali',
      validationMessage: 'Stage validé par l encadrant'
    },
    {
      id: 2,
      company: 'DataLab',
      position: 'Stagiaire Data',
      location: 'Casablanca',
      period: 'Avril 2026',
      duration: '1 mois',
      status: 'En attente',
      iconColor: 'icon-orange',
      missions: [
        'Analyse des donnees',
        'Creation dashboard'
      ],
      technologies: ['Python', 'Power BI'],
      companySupervisor: 'Mme Sara',
      academicSupervisor: 'Pr. Karim',
      validationMessage: ''
    }
  ]
}))

const mountPage = () => {
  return mount(Stages, {
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
        StageModal: {
          props: ['stageToEdit'],
          emits: ['close', 'save'],
          template: `
            <div class="stage-modal-stub">
              <p>Stage Modal</p>
              <p class="edit-title">{{ stageToEdit ? stageToEdit.company : 'new' }}</p>

              <button class="close-modal" @click="$emit('close')">
                Close
              </button>

              <button
                class="save-modal"
                @click="$emit('save', {
                  id: stageToEdit ? stageToEdit.id : 3,
                  company: stageToEdit ? 'Tech Solutions Modifie' : 'Nouveau Stage SARL',
                  position: 'Stagiaire Full Stack',
                  location: 'Rabat',
                  period: 'Juillet 2026',
                  duration: '2 mois',
                  status: 'En attente',
                  iconColor: 'icon-green',
                  missions: ['Developpement application'],
                  technologies: ['Vue.js', 'Node.js'],
                  companySupervisor: 'M. Test',
                  academicSupervisor: 'Pr. Test',
                  validationMessage: ''
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

describe('Stages.vue', () => {
  test('affiche le titre de la page stages', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Mes stages')
    expect(wrapper.text()).toContain('Gerez vos experiences professionnelles')
  })

  test('affiche la liste des stages', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Tech Solutions')
    expect(wrapper.text()).toContain('DataLab')
    expect(wrapper.text()).toContain('Stagiaire Developpeur Web')
    expect(wrapper.text()).toContain('Stagiaire Data')
  })

  test('affiche les details des stages', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Tanger - Mai - Juin 2026')
    expect(wrapper.text()).toContain('(2 mois)')
    expect(wrapper.text()).toContain('Casablanca - Avril 2026')
    expect(wrapper.text()).toContain('(1 mois)')
  })

  test('affiche missions, technologies et encadrants', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('MISSIONS REALISEES')
    expect(wrapper.text()).toContain('Developpement frontend')
    expect(wrapper.text()).toContain('Integration API')
    expect(wrapper.text()).toContain('Analyse des donnees')

    expect(wrapper.text()).toContain('TECHNOLOGIES')
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('Laravel')
    expect(wrapper.text()).toContain('Python')
    expect(wrapper.text()).toContain('Power BI')

    expect(wrapper.text()).toContain('Encadrant entreprise:')
    expect(wrapper.text()).toContain('M. Amine')
    expect(wrapper.text()).toContain('Mme Sara')
    expect(wrapper.text()).toContain('Encadrant academique:')
    expect(wrapper.text()).toContain('Pr. Benali')
    expect(wrapper.text()).toContain('Pr. Karim')
  })

  test('affiche les statuts des stages', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Validé')
    expect(wrapper.text()).toContain('En attente')
  })

  test('affiche le message de validation si disponible', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Stage validé par l encadrant')
    expect(wrapper.find('.validation-pill').exists()).toBe(true)
  })

  test('ouvre le modal pour ajouter un nouveau stage', async () => {
    const wrapper = mountPage()

    expect(wrapper.find('.stage-modal-stub').exists()).toBe(false)

    await wrapper.find('.primary-btn').trigger('click')

    expect(wrapper.find('.stage-modal-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('new')
  })

  test('ferme le modal avec event close', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    expect(wrapper.find('.stage-modal-stub').exists()).toBe(true)

    await wrapper.find('.close-modal').trigger('click')

    expect(wrapper.find('.stage-modal-stub').exists()).toBe(false)
  })

  test('ajoute un nouveau stage apres save', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Nouveau Stage SARL')
    expect(wrapper.text()).toContain('Stagiaire Full Stack')
    expect(wrapper.text()).toContain('Rabat - Juillet 2026')
  })

  test('ouvre le modal pour modifier un stage', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.edit-btn')[0].trigger('click')

    expect(wrapper.find('.stage-modal-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tech Solutions')
  })

  test('modifie un stage apres save', async () => {
    const wrapper = mountPage()

    await wrapper.findAll('.edit-btn')[0].trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Tech Solutions Modifie')
  })

  test('affiche un bouton modifier pour chaque stage', () => {
    const wrapper = mountPage()

    const editButtons = wrapper.findAll('.edit-btn')

    expect(editButtons).toHaveLength(2)
    expect(editButtons[0].text()).toBe('Modifier')
    expect(editButtons[1].text()).toBe('Modifier')
  })
})