// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Login from '../Login.vue'

describe('Login.vue', () => {
  test('affiche le composant LoginForm', () => {
    const wrapper = mount(Login, {
      global: {
        stubs: {
          LoginForm: {
            template: '<div data-test="login-form">Login Form Stub</div>'
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-test="login-form"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Login Form Stub')
  })
})