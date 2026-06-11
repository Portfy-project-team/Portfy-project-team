import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import Activites from '../Activites.vue'

vi.mock('../../../data/mockData.js', () => ({
  activities: [
    {
      id: 1,
      title: 'Hackathon ENSA',
      role: 'Participant',
      type: 'Hackathon',
      typeClass: 'type-hackathon',
      organisation: 'ENSA',
      periode: '2026',
      status: 'Verifiee',
      proofFileName: 'attestation.pdf'
    },
    {
      id: 2,
      title: 'Club Informatique',
      role: 'Membre',
      type: 'Club',
      typeClass: 'type-club',
      organisation: 'Club IT',
      periode: '2025',
      status: 'En attente'
    }
  ]
}))

const mountPage = () => {
  return mount(Activites, {
    global: {
      stubs: {
        Sidebar: true,
        Topbar: {
          props: ['title', 'userInitials'],
          template: '<div class="topbar-stub">{{ title }}</div>'
        },
        StatCard: {
          props: ['title', 'value'],
          template: '<div class="stat-card-stub">{{ title }} {{ value }}</div>'
        },
        StatusBadge: {
          props: ['status'],
          template: '<span class="status-badge-stub">{{ status }}</span>'
        },
        ActivityModal: {
          props: ['activityToEdit'],
          emits: ['close', 'save'],
          template: `
            <div class="activity-modal-stub">
              <p>Activity Modal</p>
              <button class="close-modal" @click="$emit('close')">Close</button>
              <button
                class="save-modal"
                @click="$emit('save', {
                  id: 3,
                  title: 'Nouvelle activité',
                  role: 'Organisateur',
                  type: 'Event',
                  typeClass: 'type-event',
                  organisation: 'ENSA',
                  periode: '2026',
                  status: 'En attente'
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

describe('Activites.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  test('affiche le titre de la page activités', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Mes activites')
    expect(wrapper.text()).toContain('Clubs, evenements, hackathons et engagements associatifs')
  })

  test('affiche les statistiques des activités', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Total activites 2')
    expect(wrapper.text()).toContain('Verifiees 1')
    expect(wrapper.text()).toContain('En attente 1')
  })

  test('affiche la liste des activités', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Hackathon ENSA')
    expect(wrapper.text()).toContain('Club Informatique')
    expect(wrapper.text()).toContain('ENSA')
    expect(wrapper.text()).toContain('Club IT')
  })

  test('ouvre le modal au clic sur Nouvelle activite', async () => {
    const wrapper = mountPage()

    expect(wrapper.find('.activity-modal-stub').exists()).toBe(false)

    await wrapper.find('.primary-btn').trigger('click')

    expect(wrapper.find('.activity-modal-stub').exists()).toBe(true)
  })

  test('ferme le modal au clic sur close', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    expect(wrapper.find('.activity-modal-stub').exists()).toBe(true)

    await wrapper.find('.close-modal').trigger('click')
    expect(wrapper.find('.activity-modal-stub').exists()).toBe(false)
  })

  test('ajoute une nouvelle activité après save', async () => {
    const wrapper = mountPage()

    await wrapper.find('.primary-btn').trigger('click')
    await wrapper.find('.save-modal').trigger('click')

    expect(wrapper.text()).toContain('Nouvelle activité')
    expect(wrapper.text()).toContain('Total activites 3')
  })

  test('affiche une alerte si on clique sur attestation', async () => {
    const wrapper = mountPage()

    const attestationButton = wrapper.findAll('button').find((btn) => {
      return btn.text() === 'Attestation'
    })

    expect(attestationButton).toBeTruthy()

    await attestationButton.trigger('click')

    expect(window.alert).toHaveBeenCalledWith('Attestation ajoutee : attestation.pdf')
  })
})