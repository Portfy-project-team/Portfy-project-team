import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import StageModal from '../StageModal.vue'

describe('StageModal.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  test('affiche le modal ajouter stage', () => {
    const wrapper = mount(StageModal)

    expect(wrapper.text()).toContain('Ajouter un stage')
    expect(wrapper.text()).toContain('Ajoutez une experience professionnelle')
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.draft-btn').exists()).toBe(true)
  })

  test('emet close au clic sur fermer', async () => {
    const wrapper = mount(StageModal)

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('soumet un stage valide avec statut En attente', async () => {
    const wrapper = mount(StageModal)

    const inputs = wrapper.findAll('input')
    const textarea = wrapper.find('textarea')
    const select = wrapper.find('select')

    await inputs[0].setValue('Tech Solutions')
    await inputs[1].setValue('Stagiaire Full Stack')
    await inputs[2].setValue('Tanger')
    await inputs[3].setValue('2 mois')
    await inputs[4].setValue('Juillet 2026')
    await textarea.setValue('Developpement frontend, Integration API')
    await inputs[5].setValue('Vue.js, Laravel')
    await inputs[6].setValue('M. Amine')
    await select.setValue('Pr. Benali')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.company).toBe('Tech Solutions')
    expect(saved.position).toBe('Stagiaire Full Stack')
    expect(saved.location).toBe('Tanger')
    expect(saved.period).toBe('Juillet 2026')
    expect(saved.duration).toBe('2 mois')
    expect(saved.status).toBe('En attente')
    expect(saved.missions).toEqual(['Developpement frontend', 'Integration API'])
    expect(saved.technologies).toEqual(['Vue.js', 'Laravel'])
    expect(saved.companySupervisor).toBe('M. Amine')
    expect(saved.academicSupervisor).toBe('Pr. Benali')
  })

  test('enregistre un stage comme brouillon', async () => {
    const wrapper = mount(StageModal)

    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Entreprise Test')
    await inputs[1].setValue('Stagiaire')
    await inputs[2].setValue('Rabat')
    await inputs[3].setValue('1 mois')
    await inputs[4].setValue('Aout 2026')

    await wrapper.find('.draft-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.status).toBe('Brouillon')
  })

  test('mode modification remplit les champs et conserve id/status', async () => {
    const wrapper = mount(StageModal, {
      props: {
        stageToEdit: {
          id: 7,
          company: 'Ancienne Entreprise',
          position: 'Stagiaire Web',
          location: 'Casablanca',
          period: 'Mai 2026',
          duration: '2 mois',
          missions: ['Mission 1', 'Mission 2'],
          technologies: ['React', 'Node'],
          companySupervisor: 'M. Karim',
          academicSupervisor: 'Pr. Idrissi',
          status: 'Validé',
          iconColor: 'blue',
          validationMessage: 'Stage validé'
        }
      }
    })

    expect(wrapper.text()).toContain('Modifier le stage')
    expect(wrapper.find('.draft-btn').exists()).toBe(false)
    expect(wrapper.findAll('input')[0].element.value).toBe('Ancienne Entreprise')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.id).toBe(7)
    expect(saved.status).toBe('Validé')
    expect(saved.iconColor).toBe('blue')
    expect(saved.validationMessage).toBe('Stage validé')
  })

  test('upload rapport PDF valide affiche le nom du fichier', async () => {
    const wrapper = mount(StageModal)

    const file = new File(['pdf'], 'rapport.pdf', {
      type: 'application/pdf'
    })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })

    await input.trigger('change')

    expect(wrapper.text()).toContain('rapport.pdf')
  })

  test('refuse un rapport non PDF', async () => {
    const wrapper = mount(StageModal)

    const file = new File(['image'], 'rapport.png', {
      type: 'image/png'
    })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })

    await input.trigger('change')

    expect(window.alert).toHaveBeenCalledWith('Le rapport doit etre un fichier PDF')
  })
})