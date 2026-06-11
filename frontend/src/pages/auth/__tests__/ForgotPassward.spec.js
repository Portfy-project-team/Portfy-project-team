// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import ForgotPassward from '../ForgotPassward.vue'

describe('ForgotPassward.vue', () => {
  test('affiche le composant ForgotForm', () => {
    const wrapper = mount(ForgotPassward, {
      global: {
        stubs: {
          ForgotForm: {
            template: '<div data-test="forgot-form">Forgot Form Stub</div>'
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-test="forgot-form"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Forgot Form Stub')
  })
})