import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import ActivityModal from '../ActivityModal.vue'

describe('ActivityModal.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  test('affiche le modal nouvelle activite', () => {
    const wrapper = mount(ActivityModal)

    expect(wrapper.text()).toContain('Nouvelle activite')
    expect(wrapper.text()).toContain('Ajoutez un club, evenement, hackathon ou engagement associatif')
    expect(wrapper.find('.submit-btn').attributes('disabled')).toBeDefined()
  })

  test('emet close au clic sur fermer', async () => {
    const wrapper = mount(ActivityModal)

    await wrapper.find('.close-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('emet close au clic sur annuler', async () => {
    const wrapper = mount(ActivityModal)

    await wrapper.find('.cancel-btn').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('soumet une activite valide avec statut En attente', async () => {
    const wrapper = mount(ActivityModal)

    const inputs = wrapper.findAll('input')
    const select = wrapper.find('select')
    const textarea = wrapper.find('textarea')

    await inputs[0].setValue('Hackathon ENSA')
    await inputs[1].setValue('Participant')
    await select.setValue('Hackathon')
    await inputs[2].setValue('ENSA Tanger')
    await inputs[3].setValue('Mars 2026')
    await textarea.setValue('Participation a un hackathon')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.title).toBe('Hackathon ENSA')
    expect(saved.role).toBe('Participant')
    expect(saved.type).toBe('Hackathon')
    expect(saved.typeClass).toBe('type-hackathon')
    expect(saved.organisation).toBe('ENSA Tanger')
    expect(saved.periode).toBe('Mars 2026')
    expect(saved.status).toBe('En attente')
  })

  test('enregistre une activite comme brouillon', async () => {
    const wrapper = mount(ActivityModal)

    const inputs = wrapper.findAll('input')
    const select = wrapper.find('select')

    await inputs[0].setValue('Club Informatique')
    await inputs[1].setValue('Membre')
    await select.setValue('Club')
    await inputs[2].setValue('Club IT')
    await inputs[3].setValue('2025 - 2026')

    await wrapper.find('.draft-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.status).toBe('Brouillon')
    expect(saved.typeClass).toBe('type-club')
  })

  test('mode modification remplit les champs et conserve id/status', async () => {
    const wrapper = mount(ActivityModal, {
      props: {
        activityToEdit: {
          id: 10,
          title: 'Activite ancienne',
          role: 'Organisateur',
          type: 'Evenement',
          organisation: 'ENSA',
          periode: '2026',
          description: 'Description',
          status: 'Validé'
        }
      }
    })

    expect(wrapper.text()).toContain('Modifier activite')
    expect(wrapper.find('.draft-btn').exists()).toBe(false)
    expect(wrapper.findAll('input')[0].element.value).toBe('Activite ancienne')

    await wrapper.find('.submit-btn').trigger('click')

    const saved = wrapper.emitted('save')[0][0]

    expect(saved.id).toBe(10)
    expect(saved.status).toBe('Validé')
  })

  test('upload preuve valide affiche le nom du fichier', async () => {
    const wrapper = mount(ActivityModal)

    const file = new File(['test'], 'attestation.pdf', {
      type: 'application/pdf'
    })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })

    await input.trigger('change')

    expect(wrapper.text()).toContain('attestation.pdf')
  })

  test('refuse fichier preuve invalide', async () => {
    const wrapper = mount(ActivityModal)

    const file = new File(['test'], 'virus.exe', {
      type: 'application/x-msdownload'
    })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })

    await input.trigger('change')

    expect(window.alert).toHaveBeenCalledWith('Le fichier doit etre PDF, PNG ou JPG')
  })
})