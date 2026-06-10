// ─────────────────────────────────────────────────────────────
//  TEST COMPOSANT — StatCard
//  cypress/component/student/StatCard.cy.js
// ─────────────────────────────────────────────────────────────
import StatCard from '@/components/student/StatCard.vue'

describe('StatCard.vue — Composant', () => {
  it('affiche le titre et la valeur passés en props', () => {
    cy.mount(StatCard, {
      props: { title: 'Total Étudiants', value: 45, icon: 'users' },
    })
    cy.get('[data-cy="stat-card-title"]').should('contain', 'Total Étudiants')
    cy.get('[data-cy="stat-card-value"]').should('contain', '45')
  })

  it("affiche une icône si la prop icon est fournie", () => {
    cy.mount(StatCard, {
      props: { title: 'Cours', value: 3, icon: 'book' },
    })
    cy.get('[data-cy="stat-card-icon"]').should('exist')
  })

  it('applique une couleur de variation positive (tendance hausse)', () => {
    cy.mount(StatCard, {
      props: { title: 'Notes', value: 14.5, trend: '+5%', trendType: 'up' },
    })
    cy.get('[data-cy="stat-card-trend"]')
      .should('contain', '+5%')
      .and('have.class', 'trend-up')
  })

  it('applique une couleur de variation négative (tendance baisse)', () => {
    cy.mount(StatCard, {
      props: { title: 'Présences', value: 80, trend: '-3%', trendType: 'down' },
    })
    cy.get('[data-cy="stat-card-trend"]').should('have.class', 'trend-down')
  })

  it("affiche 0 si la valeur est 0 (pas d'affichage vide)", () => {
    cy.mount(StatCard, { props: { title: 'Absences', value: 0 } })
    cy.get('[data-cy="stat-card-value"]').should('contain', '0')
  })
})
