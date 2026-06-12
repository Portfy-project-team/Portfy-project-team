describe('Student Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/student/dashboard')
  })

  it('displays dashboard with student info', () => {
    cy.get('.topbar-title').should('contain', 'Dashboard')
    cy.get('.profile-btn').should('exist')
  })

  it('displays stat cards', () => {
    cy.get('.stat-card').should('have.length.at.least', 1)
    cy.get('.value').should('be.visible')
  })

  it('sidebar has all navigation links', () => {
    cy.get('.nav-item').should('have.length.greaterThan', 5)
  })

  it('can navigate to formations page', () => {
    cy.get('[href*="formations"]').click()
    cy.url().should('include', '/formations')
  })

  it('can navigate to stages page', () => {
    cy.get('[href*="stages"]').click()
    cy.url().should('include', '/stages')
  })

  it('can navigate to projects page', () => {
    cy.get('[href*="projects"]').click()
    cy.url().should('include', '/projects')
  })

  it('can toggle sidebar', () => {
    cy.get('.sidebar').should('have.css', 'width', '220px')
    cy.get('.toggle-btn').click()
    cy.get('.sidebar').should('have.class', 'closed')
  })

  it('search box accepts input', () => {
    cy.get('.search-box input')
      .type('React')
      .should('have.value', 'React')
  })

  it('profile button is clickable', () => {
    cy.get('.profile-btn').should('be.visible').click()
  })

  it('displays correct student name in sidebar', () => {
    cy.get('.profile-name').should('contain', 'Insaf Hamdane')
  })

  it('displays score badge', () => {
    cy.get('.score-badge').should('contain', '82')
  })

  it('has logout button', () => {
    cy.get('.logout-btn').should('be.visible')
  })
})

describe('Student Portfolio Pages E2E', () => {
  beforeEach(() => {
    cy.visit('/student/dashboard')
  })

  it('can view formations', () => {
    cy.get('[href*="formations"]').click()
    cy.url().should('include', '/formations')
    cy.get('body').should('be.visible')
  })

  it('can view stages', () => {
    cy.get('[href*="stages"]').click()
    cy.url().should('include', '/stages')
  })

  it('can view projects', () => {
    cy.get('[href*="projects"]').click()
    cy.url().should('include', '/projects')
  })

  it('can view competences', () => {
    cy.get('[href*="competences"]').click()
    cy.url().should('include', '/competences')
  })

  it('can view activities', () => {
    cy.get('[href*="activites"]').click()
    cy.url().should('include', '/activites')
  })

  it('can view letters', () => {
    cy.get('[href*="lettres"]').click()
    cy.url().should('include', '/lettres')
  })
})

describe('Modal Interactions E2E', () => {
  beforeEach(() => {
    cy.visit('/student/dashboard')
  })

  it('can open formation modal', () => {
    cy.get('[href*="formations"]').click()
    cy.get('[data-cy="open-formation-modal"]').click()
    cy.get('.modal-card').should('be.visible')
  })

  it('can close modal with cancel button', () => {
    cy.get('[href*="formations"]').click()
    cy.get('[data-cy="open-formation-modal"]').click()
    cy.get('.cancel-btn').click()
    cy.get('.modal-card').should('not.exist')
  })

  it('can close modal with close button', () => {
    cy.get('[href*="formations"]').click()
    cy.get('[data-cy="open-formation-modal"]').click()
    cy.get('.close-btn').click()
    cy.get('.modal-card').should('not.exist')
  })
})
