describe('Topbar Component', () => {
  it('renders with correct title and user initials', () => {
    cy.mount({
      template: '<Topbar title="Dashboard" userInitials="AA" />',
      components: { Topbar: require('../../src/components/student/Topbar.vue').default }
    })

    cy.get('.topbar-title').should('contain', 'Dashboard')
    cy.get('.profile-btn').should('contain', 'AA')
  })

  it('renders search box', () => {
    cy.mount({
      template: '<Topbar />',
      components: { Topbar: require('../../src/components/student/Topbar.vue').default }
    })

    cy.get('.search-box input').should('have.attr', 'placeholder', 'Rechercher')
  })

  it('renders notification button', () => {
    cy.mount({
      template: '<Topbar />',
      components: { Topbar: require('../../src/components/student/Topbar.vue').default }
    })

    cy.get('.notif-btn').should('exist')
  })

  it('renders profile button with avatar background', () => {
    cy.mount({
      template: '<Topbar userInitials="FB" />',
      components: { Topbar: require('../../src/components/student/Topbar.vue').default }
    })

    cy.get('.profile-btn')
      .should('contain', 'FB')
      .should('have.css', 'border-radius', '50%')
  })

  it('user can type in search box', () => {
    cy.mount({
      template: '<Topbar />',
      components: { Topbar: require('../../src/components/student/Topbar.vue').default }
    })

    cy.get('.search-box input')
      .type('React')
      .should('have.value', 'React')
  })

  it('displays correct topbar height', () => {
    cy.mount({
      template: '<Topbar />',
      components: { Topbar: require('../../src/components/student/Topbar.vue').default }
    })

    cy.get('.topbar').should('have.css', 'height', '60px')
  })

  it('renders all action buttons', () => {
    cy.mount({
      template: '<Topbar />',
      components: { Topbar: require('../../src/components/student/Topbar.vue').default }
    })

    cy.get('.topbar-actions').children().should('have.length', 3)
  })
})
