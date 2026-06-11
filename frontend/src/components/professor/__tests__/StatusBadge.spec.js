import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import StatusBadge from '../StatusBadge.vue'

describe('Professor StatusBadge.vue', () => {
  test('affiche Publiée pour status published', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'published'
      }
    })

    expect(wrapper.text()).toBe('Publiée')
    expect(wrapper.classes()).toContain('badge')
    expect(wrapper.classes()).toContain('published')
  })

  test('affiche En attente pour status pending', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'pending'
      }
    })

    expect(wrapper.text()).toBe('En attente')
    expect(wrapper.classes()).toContain('badge')
    expect(wrapper.classes()).toContain('pending')
  })

  test('affiche Validé pour status validated', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'validated'
      }
    })

    expect(wrapper.text()).toBe('Validé')
    expect(wrapper.classes()).toContain('badge')
    expect(wrapper.classes()).toContain('validated')
  })

  test('affiche le texte original si status inconnu', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'refused'
      }
    })

    expect(wrapper.text()).toBe('refused')
    expect(wrapper.classes()).toContain('badge')
    expect(wrapper.classes()).toContain('refused')
  })
})