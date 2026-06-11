import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Competences from '../Competences.vue'

vi.mock('../../../data/mockData.js', () => ({
  competenceGroups: [
    {
      id: 1,
      title: 'Techniques',
      subtitle: 'Competences techniques',
      color: 'purple',
      skills: [
        {
          name: 'Vue.js',
          level: 80,
          category: 'Technique',
          source: 'Projet portfolio'
        },
        {
          name: 'JavaScript',
          level: 75,
          category: 'Technique',
          source: 'Formation web'
        }
      ]
    },
    {
      id: 2,
      title: 'Soft Skills',
      subtitle: 'Competences comportementales',
      color: 'green',
      skills: [
        {
          name: 'Communication',
          level: 90,
          category: 'Soft Skill',
          source: 'Travail equipe'
        }
      ]
    },
    {
      id: 3,
      title: 'Langues',
      subtitle: 'Niveau linguistique',
      color: 'orange',
      skills: [
        {
          name: 'Français',
          level: 85,
          category: 'Langue',
          source: 'Certification'
        }
      ]
    }
  ]
}))

const mountPage = () => {
  return mount(Competences, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title', 'userInitials'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        },
        CompetenceModal: {
          emits: ['close', 'save'],
          template: `
            <div class="competence-modal-stub">
              <p>Competence Modal</p>
              <button class="close-modal" @click="$emit('close')">Close</button>
              <button
                class="save-modal"
                @click="$emit('save', {
                  name: 'Docker',
                  level: 60,
                  category: 'Technique',
                  source: 'Autoformation'
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

describe('Competences.vue', () => {
  test('affiche le titre de la page competences', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Mes competences')
    expect(wrapper.text()).toContain('Competences techniques, soft skills et langues')
  })

  test('affiche les groupes de competences', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Techniques')
    expect(wrapper.text()).toContain('Soft Skills')
    expect(wrapper.text()).toContain('Langues')
  })

  test('affiche les competences dans le tableau', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('JavaScript')
    expect(wrapper.text()).toContain('Communication')
    expect(wrapper.text()).toContain('Français')
  })

  test('filtre les competences techniques', async () => {
    const wrapper = mountPage()

    const techniqueButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Techniques')

    await techniqueButton.trigger('click')

    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('JavaScript')
    expect(wrapper.text()).not.toContain('Communication')
    expect(wrapper.text()).not.toContain('Français')
  })

  test('filtre les soft skills', async () => {
    const wrapper = mountPage()

    const softButton = wrapper
      .findAll('.filter-btn')
      .find((button) => button.text() === 'Soft Skills')

    await softButton.trigger('click')

    expect(wrapper.text()).toContain('Communication')
    expect(wrapper.text()).not.toContain('Vue.js')
    expect(wrapper.text()).not.toContain('Français')
  })

  test('ouvre le modal au clic sur Ajouter une competence', async () => {
    const wrapper = mountPage()

    expect(wrapper.find('.competence-modal-stub').exists()).toBe(false)

    await wrapper.find('.primary-btn').trigger('click')

    expect(wrapper.find('.competence-modal-stub').exists()).toBe(true)
  })

  test('ferme le modal avec event close', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    expect(wrapper.find('.competence-modal-stub').exists()).toBe(true)

    await wrapper.find('.close-modal').trigger('click')
    expect(wrapper.find('.competence-modal-stub').exists()).toBe(false)
  })

  test('ajoute une competence apres save', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Docker')
    expect(wrapper.text()).toContain('Autoformation')
  })
})