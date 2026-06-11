import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import FormationModal from '../FormationModal.vue'

describe('FormationModal.vue', () => {
  test('affiche le modal ajouter formation', () => {
    const wrapper = mount(FormationModal)

    expect(wrapper.text()).toContain('Ajouter une formation')
    expect(wrapper.text()).toContain('Ajoutez une certification, MOOC ou formation continue')
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeDefined()
  })

  test('emet close au clic sur fermer', async () => {
    const wrapper = mount(FormationModal)

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('emet close au clic sur annuler', async () => {
    const wrapper = mount(FormationModal)

    await wrapper.find('.cancel-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('ajoute une formation valide', async () => {
    const wrapper = mount(FormationModal)

    const inputs = wrapper.findAll('input')
    const select = wrapper.find('select')

    await inputs[0].setValue('Vue.js Avance')
    await inputs[1].setValue('Coursera')
    await select.setValue('Certification')
    await inputs[2].setValue('Juin 2026')
    await inputs[3].setValue('100')
    await inputs[4].setValue('Vue.js, Frontend')
    await inputs[5].setValue('https://example.com/certificat')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.title).toBe('Vue.js Avance')
    expect(saved.provider).toBe('Coursera')
    expect(saved.status).toBe('Certifie')
    expect(saved.progress).toBe(100)
    expect(saved.progressColor).toBe('green')
    expect(saved.label).toBe('Certification')
    expect(saved.date).toBe('Juin 2026')
    expect(saved.tags).toEqual(['Vue.js', 'Frontend'])
    expect(saved.certificateLink).toBe('https://example.com/certificat')
    expect(saved.links).toEqual(['Certificat', 'Voir'])
  })

  test('mode modification remplit les champs et conserve id/status', async () => {
    const wrapper = mount(FormationModal, {
      props: {
        formationToEdit: {
          id: 5,
          title: 'Docker Basics',
          provider: 'Udemy',
          label: 'MOOC',
          date: 'Mai 2026',
          progress: 60,
          tags: ['Docker', 'DevOps'],
          certificateLink: '',
          status: 'En cours',
          iconColor: 'orange'
        }
      }
    })

    expect(wrapper.text()).toContain('Modifier la formation')
    expect(wrapper.findAll('input')[0].element.value).toBe('Docker Basics')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.id).toBe(5)
    expect(saved.status).toBe('En cours')
    expect(saved.iconColor).toBe('orange')
    expect(saved.progress).toBe(60)
    expect(saved.progressColor).toBe('purple-orange')
  })
})