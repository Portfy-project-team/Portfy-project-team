// ─────────────────────────────────────────────────────────────
//  TEST COMPOSANT — StatusBadge
//  cypress/component/student/StatusBadge.cy.js
// ─────────────────────────────────────────────────────────────
import StatusBadge from '@/components/student/StatusBadge.vue'

describe('StatusBadge.vue — Composant', () => {
  const statuses = [
    { status: 'active',   label: 'Actif',    expectedClass: 'badge-active' },
    { status: 'inactive', label: 'Inactif',  expectedClass: 'badge-inactive' },
    { status: 'pending',  label: 'En attente', expectedClass: 'badge-pending' },
  ]

  statuses.forEach(({ status, label, expectedClass }) => {
    it(`affiche correctement le badge "${label}"`, () => {
      cy.mount(StatusBadge, { props: { status } })
      cy.get('[data-cy="status-badge"]')
        .should('be.visible')
        .and('contain', label)
        .and('have.class', expectedClass)
    })
  })

  it('affiche un badge par défaut pour un statut inconnu', () => {
    cy.mount(StatusBadge, { props: { status: 'unknown' } })
    cy.get('[data-cy="status-badge"]').should('exist')
  })
})
