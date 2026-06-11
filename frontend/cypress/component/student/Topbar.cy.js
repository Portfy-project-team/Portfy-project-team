import Topbar from '@/components/student/Topbar.vue'
import { createRouter, createMemoryHistory } from 'vue-router'

describe('Topbar Component', () => {
  const mountTopbar = (props = {}) => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/student/notifications', component: { template: '<div>Notifications</div>' } },
        { path: '/student/parametres', component: { template: '<div>Parametres</div>' } },
      ],
    })

    cy.mount(Topbar, {
      props,
      global: {
        plugins: [router],
      },
    })
  }

  it('renders with correct title and user initials', () => {
    mountTopbar({
      title: 'Dashboard',
      userInitials: 'AA',
    })

    cy.get('.topbar-title').should('contain', 'Dashboard')
    cy.get('.profile-btn').should('contain', 'AA')
  })

  it('renders search box', () => {
    mountTopbar()

    cy.get('.search-box input').should('have.attr', 'placeholder', 'Rechercher')
  })

  it('renders notification button', () => {
    mountTopbar()

    cy.get('.notif-btn').should('exist')
  })

  it('renders profile button with initials', () => {
    mountTopbar({
      userInitials: 'FB',
    })

    cy.get('.profile-btn').should('contain', 'FB')
  })

  it('user can type in search box', () => {
    mountTopbar()

    cy.get('.search-box input')
      .type('React')
      .should('have.value', 'React')
  })

  it('displays correct topbar height', () => {
    mountTopbar()

    cy.get('.topbar').should('have.css', 'height', '60px')
  })

  it('renders all action elements', () => {
    mountTopbar()

    cy.get('.topbar-actions').children().should('have.length', 3)
    cy.get('.search-box').should('exist')
    cy.get('.notif-btn').should('exist')
    cy.get('.profile-btn').should('exist')
  })
})