import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import CompetenceModal from '../CompetenceModal.vue'

describe('CompetenceModal.vue', () => {
  test('affiche le modal nouvelle competence', () => {
    const wrapper = mount(CompetenceModal)

    expect(wrapper.text()).toContain('Nouvelle competence')
    expect(wrapper.text()).toContain('Ajoutez une competence a votre profil')
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeDefined()
  })

  test('emet close au clic sur fermer', async () => {
    const wrapper = mount(CompetenceModal)

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('emet close au clic sur annuler', async () => {
    const wrapper = mount(CompetenceModal)

    await wrapper.find('.cancel-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('ajoute une competence valide', async () => {
    const wrapper = mount(CompetenceModal)

    const inputs = wrapper.findAll('input')
    const select = wrapper.find('select')

    await inputs[0].setValue('Vue.js')
    await select.setValue('Technique')
    await inputs[1].setValue('85')
    await inputs[2].setValue('Projet portfolio')

    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeUndefined()

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.name).toBe('Vue.js')
    expect(saved.category).toBe('Technique')
    expect(saved.level).toBe(85)
    expect(saved.source).toBe('Projet portfolio')
  })

  test('ne sauvegarde pas si formulaire incomplet', async () => {
    const wrapper = mount(CompetenceModal)

    await wrapper.find('.submit-btn').trigger('click')

    expect(wrapper.emitted('save')).toBeFalsy()
  })
})