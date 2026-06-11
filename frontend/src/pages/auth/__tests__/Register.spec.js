// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Register from '../Register.vue'

describe('Register.vue', () => {
  test('affiche le composant RegisterForm', () => {
    const wrapper = mount(Register, {
      global: {
        stubs: {
          RegisterForm: {
            template: '<div data-test="register-form">Register Form Stub</div>'
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-test="register-form"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Register Form Stub')
  })
})