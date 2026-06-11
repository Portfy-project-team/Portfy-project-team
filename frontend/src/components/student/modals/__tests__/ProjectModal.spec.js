import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import ProjectModal from '../ProjectModal.vue'

describe('ProjectModal.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  test('affiche le modal ajouter projet', () => {
    const wrapper = mount(ProjectModal)

    expect(wrapper.text()).toContain('Ajouter un projet')
    expect(wrapper.text()).toContain('Ajoutez un projet academique ou personnel')
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.draft-btn').exists()).toBe(true)
  })

  test('emet close au clic sur fermer', async () => {
    const wrapper = mount(ProjectModal)

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('emet close au clic sur annuler', async () => {
    const wrapper = mount(ProjectModal)

    await wrapper.find('.cancel-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('soumet un projet valide avec statut En attente', async () => {
    const wrapper = mount(ProjectModal)

    const inputs = wrapper.findAll('input')
    const textarea = wrapper.find('textarea')
    const selects = wrapper.findAll('select')

    await inputs[0].setValue('Portfolio Web')
    await textarea.setValue('Projet de portfolio numerique')
    await selects[0].setValue("Projet d'integration")
    await selects[1].setValue('Pr. Benali')
    await inputs[1].setValue('Vue.js, Node.js')
    await inputs[2].setValue('https://github.com/test/portfolio')
    await inputs[3].setValue('https://demo.com')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.title).toBe('Portfolio Web')
    expect(saved.description).toBe('Projet de portfolio numerique')
    expect(saved.type).toBe("Projet d'integration")
    expect(saved.status).toBe('En attente')
    expect(saved.tags).toEqual(['Vue.js', 'Node.js'])
    expect(saved.supervisor).toBe('Pr. Benali')
    expect(saved.github).toBe('https://github.com/test/portfolio')
    expect(saved.demo).toBe('https://demo.com')
  })

  test('enregistre un projet comme brouillon', async () => {
    const wrapper = mount(ProjectModal)

    const inputs = wrapper.findAll('input')
    const textarea = wrapper.find('textarea')
    const selects = wrapper.findAll('select')

    await inputs[0].setValue('Projet brouillon')
    await textarea.setValue('Description test')
    await selects[0].setValue('Projet personnel')
    await inputs[1].setValue('Vue.js')

    await wrapper.find('.draft-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.status).toBe('Brouillon')
  })

  test('mode modification remplit les champs et conserve id/status', async () => {
    const wrapper = mount(ProjectModal, {
      props: {
        projectToEdit: {
          id: 22,
          title: 'Ancien projet',
          description: 'Ancienne description',
          type: 'Projet personnel',
          supervisor: 'Pr. Idrissi',
          tags: ['Laravel', 'MySQL'],
          github: 'https://github.com/old',
          demo: 'https://old-demo.com',
          status: 'Validé',
          date: 'Mars 2026',
          correction: ''
        }
      }
    })

    expect(wrapper.text()).toContain('Modifier le projet')
    expect(wrapper.find('.draft-btn').exists()).toBe(false)
    expect(wrapper.findAll('input')[0].element.value).toBe('Ancien projet')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.id).toBe(22)
    expect(saved.status).toBe('Validé')
    expect(saved.tags).toEqual(['Laravel', 'MySQL'])
  })

  test('upload image valide affiche le nom du fichier', async () => {
    const wrapper = mount(ProjectModal)

    const file = new File(['image'], 'screen.png', {
      type: 'image/png'
    })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })

    await input.trigger('change')

    expect(wrapper.text()).toContain('screen.png')
  })

  test('refuse fichier image invalide', async () => {
    const wrapper = mount(ProjectModal)

    const file = new File(['test'], 'document.pdf', {
      type: 'application/pdf'
    })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })

    await input.trigger('change')

    expect(window.alert).toHaveBeenCalledWith('La capture doit etre une image PNG ou JPG')
  })
})