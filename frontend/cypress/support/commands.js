import './commands'
import { mount } from 'cypress/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const EmptyPage = {
  template: '<div data-cy="empty-page">Page test</div>',
}

Cypress.Commands.add('mountWithAuthPlugins', (component, options = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: EmptyPage },
      { path: '/login', component: EmptyPage },
      { path: '/register', component: EmptyPage },
      { path: '/forgot-password', component: EmptyPage },
      { path: '/dashboard', component: EmptyPage },
      { path: '/pending-validation', component: EmptyPage },
      { path: '/conditions', component: EmptyPage },
      { path: '/politique', component: EmptyPage },
    ],
  })

  router.push(options.route || '/')

  return router.isReady().then(() => {
    return mount(component, {
      ...options,
      global: {
        ...(options.global || {}),
        plugins: [pinia, router],
      },
    })
  })
})