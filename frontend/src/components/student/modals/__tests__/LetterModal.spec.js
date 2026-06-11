import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import LetterModal from '../LetterModal.vue'

describe('LetterModal.vue', () => {
  test('affiche le modal demande lettre', () => {
    const wrapper = mount(LetterModal)

    expect(wrapper.text()).toContain('Demander une lettre')
    expect(wrapper.text()).toContain('Envoyez une demande de recommandation a un enseignant')
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeDefined()
  })

  test('emet close au clic sur fermer', async () => {
    const wrapper = mount(LetterModal)

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('emet close au clic sur annuler', async () => {
    const wrapper = mount(LetterModal)

    await wrapper.find('.cancel-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('envoie une demande de lettre valide', async () => {
    const wrapper = mount(LetterModal)

    const inputs = wrapper.findAll('input')
    const selects = wrapper.findAll('select')
    const textarea = wrapper.find('textarea')

    await inputs[0].setValue('Pr. Mohamed Benali')
    await inputs[1].setValue('Candidature Master')
    await selects[0].setValue('Stage')
    await selects[1].setValue('Publique')
    await textarea.setValue('Merci de me recommander.')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.professor).toBe('Pr. Mohamed Benali')
    expect(saved.initials).toBe('PM')
    expect(saved.status).toBe('En attente')
    expect(saved.visibility).toBe('Publique')
    expect(saved.object).toBe('Candidature Master')
    expect(saved.purpose).toBe('Stage')
    expect(saved.message).toBe('Merci de me recommander.')
    expect(saved.requestText).toContain('Demande envoyee')
  })

  test('ne sauvegarde pas si formulaire incomplet', async () => {
    const wrapper = mount(LetterModal)

    await wrapper.find('.submit-btn').trigger('click')

    expect(wrapper.emitted('save')).toBeFalsy()
  })
})