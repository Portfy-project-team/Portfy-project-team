import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import StatCard from '../StatCard.vue'

describe('StatCard.vue', () => {
  test('affiche title, value, unit et subtitle', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Projets validés',
        value: 12,
        unit: '%',
        subtitle: '+3 ce mois'
      }
    })

    expect(wrapper.text()).toContain('Projets validés')
    expect(wrapper.find('.value').text()).toBe('12')
    expect(wrapper.find('.unit').text()).toBe('%')
    expect(wrapper.text()).toContain('+3 ce mois')
  })

  test('affiche les valeurs par défaut', () => {
    const wrapper = mount(StatCard)

    expect(wrapper.text()).toContain('Projets')
    expect(wrapper.find('.value').text()).toBe('0')
    expect(wrapper.find('.unit').exists()).toBe(false)
  })

  test('applique la classe couleur du carré', () => {
    const wrapper = mount(StatCard, {
      props: {
        color: 'green'
      }
    })

    expect(wrapper.find('.stat-square').classes()).toContain('square-green')
  })

  test('applique la classe couleur du subtitle', () => {
    const wrapper = mount(StatCard, {
      props: {
        subtitle: 'Progression positive',
        subtitleColor: 'orange'
      }
    })

    expect(wrapper.find('.stat-subtitle').classes()).toContain('subtitle-orange')
  })
})