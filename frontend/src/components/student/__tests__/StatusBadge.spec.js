import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import StatusBadge from '../StatusBadge.vue'

describe('StatusBadge.vue', () => {
  test('affiche le statut passé en props', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'En attente'
      }
    })

    expect(wrapper.text()).toBe('En attente')
  })

  test('applique status-valid pour Valide', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Validé'
      }
    })

    expect(wrapper.classes()).toContain('status-valid')
  })

  test('applique status-valid pour Certifié', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Certifié'
      }
    })

    expect(wrapper.classes()).toContain('status-valid')
  })

  test('applique status-pending pour En attente', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'En attente'
      }
    })

    expect(wrapper.classes()).toContain('status-pending')
  })

  test('applique status-correction pour Correction demandée', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Correction demandée'
      }
    })

    expect(wrapper.classes()).toContain('status-correction')
  })

  test('applique status-draft pour Brouillon', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Brouillon'
      }
    })

    expect(wrapper.classes()).toContain('status-draft')
  })

  test('applique status-rejected pour Refusé', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Refusé'
      }
    })

    expect(wrapper.classes()).toContain('status-rejected')
  })

  test('applique status-default pour statut inconnu', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Inconnu'
      }
    })

    expect(wrapper.classes()).toContain('status-default')
  })
})