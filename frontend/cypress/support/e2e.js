// Support file for E2E tests

// Add custom commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/student/dashboard')
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-btn"]').click()
  cy.url().should('include', '/login')
})

Cypress.Commands.add('openModal', (modalName) => {
  cy.get(`[data-cy="open-${modalName}-modal"]`).click()
  cy.get('[data-cy="modal-overlay"]').should('be.visible')
})

Cypress.Commands.add('closeModal', () => {
  cy.get('.close-btn').click()
  cy.get('[data-cy="modal-overlay"]').should('not.exist')
})

Cypress.Commands.add('fillFormationModal', (formation) => {
  if (formation.title) cy.get('input[placeholder*="AWS"]').type(formation.title)
  if (formation.provider) cy.get('input[placeholder*="Coursera"]').type(formation.provider)
  if (formation.type) cy.get('select').first().select(formation.type)
  if (formation.progress) cy.get('input[type="number"]').type(formation.progress)
})

Cypress.Commands.add('fillStageModal', (stage) => {
  if (stage.company) cy.get('input[placeholder*="OCP"]').type(stage.company)
  if (stage.position) cy.get('input[placeholder*="Développeur"]').type(stage.position)
  if (stage.location) cy.get('input[placeholder*="Casablanca"]').type(stage.location)
  if (stage.period) cy.get('input[placeholder*="Juillet"]').type(stage.period)
  if (stage.duration) cy.get('input[placeholder*="2 mois"]').type(stage.duration)
})

Cypress.Commands.add('fillLetterModal', (letter) => {
  if (letter.professor) cy.get('input[placeholder*="Pr."]').type(letter.professor)
  if (letter.subject) cy.get('input[placeholder*="Candidature"]').type(letter.subject)
  if (letter.purpose) cy.get('select').first().select(letter.purpose)
})

Cypress.Commands.add('fillProjectModal', (project) => {
  if (project.title) cy.get('input[placeholder*="API REST"]').type(project.title)
  if (project.description) cy.get('textarea').first().type(project.description)
  if (project.technologies) cy.get('input[placeholder*="React"]').type(project.technologies)
})

Cypress.Commands.add('fillActivityModal', (activity) => {
  if (activity.title) cy.get('input[placeholder*="Hackathon"]').type(activity.title)
  if (activity.role) cy.get('input[placeholder*="Participant"]').type(activity.role)
  if (activity.type) cy.get('select').first().select(activity.type)
})

Cypress.Commands.add('fillCompetenceModal', (competence) => {
  if (competence.name) cy.get('input[placeholder*="React"]').type(competence.name)
  if (competence.category) cy.get('select').first().select(competence.category)
  if (competence.level) cy.get('input[type="number"]').type(competence.level)
})

export {}


import './commands'

// Reset localStorage avant chaque test pour isoler les sessions
beforeEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()
})

// Log global des erreurs non catchées (aide au debug)
Cypress.on('uncaught:exception', (err) => {
  // Ne pas faire échouer les tests sur les erreurs Vue Router
  // provenant du rendu asynchrone (connues et non bloquantes)
  if (
    err.message.includes('Navigation cancelled') ||
    err.message.includes('Avoided redundant navigation')
  ) {
    return false
  }
})
