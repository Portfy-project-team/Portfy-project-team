import { describe, it, expect, beforeEach } from '@cypress/webpack-dev-server'

describe('StatusBadge Component', () => {
  beforeEach(() => {
    cy.fixture('formations').then((data) => {
      cy.wrap(data)
    })
  })

  it('displays valid status with correct styling', () => {
    cy.mount({
      template: '<StatusBadge status="Valide" />',
      components: { StatusBadge: require('../../src/components/student/StatusBadge.vue').default }
    })

    cy.get('.status-badge')
      .should('have.class', 'status-valid')
      .should('contain', 'Valide')
      .should('have.css', 'background', 'rgb(214, 247, 228)')
  })

  it('displays pending status correctly', () => {
    cy.mount({
      template: '<StatusBadge status="En attente" />',
      components: { StatusBadge: require('../../src/components/student/StatusBadge.vue').default }
    })

    cy.get('.status-badge')
      .should('have.class', 'status-pending')
      .should('contain', 'En attente')
  })

  it('displays draft status correctly', () => {
    cy.mount({
      template: '<StatusBadge status="Brouillon" />',
      components: { StatusBadge: require('../../src/components/student/StatusBadge.vue').default }
    })

    cy.get('.status-badge').should('have.class', 'status-draft')
  })

  it('displays rejected status correctly', () => {
    cy.mount({
      template: '<StatusBadge status="Refuse" />',
      components: { StatusBadge: require('../../src/components/student/StatusBadge.vue').default }
    })

    cy.get('.status-badge').should('have.class', 'status-rejected')
  })

  it('displays certified status with valid styling', () => {
    cy.mount({
      template: '<StatusBadge status="Certifie" />',
      components: { StatusBadge: require('../../src/components/student/StatusBadge.vue').default }
    })

    cy.get('.status-badge')
      .should('have.class', 'status-valid')
      .should('contain', 'Certifie')
  })
})
