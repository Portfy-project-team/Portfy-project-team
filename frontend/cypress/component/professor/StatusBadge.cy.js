/*import StatusBadge from '@/components/professor/StatusBadge.vue'

describe('StatusBadge', () => {
  it('mappe "published" → "Publiée" avec la classe published', () => {
    cy.mount(StatusBadge, { props: { status: 'published' } })
    cy.get('.badge').should('contain', 'Publiée').and('have.class', 'published')
  })

  it('mappe "pending" → "En attente"', () => {
    cy.mount(StatusBadge, { props: { status: 'pending' } })
    cy.get('.badge').should('contain', 'En attente').and('have.class', 'pending')
  })

  it('mappe "validated" → "Validé"', () => {
    cy.mount(StatusBadge, { props: { status: 'validated' } })
    cy.get('.badge').should('contain', 'Validé').and('have.class', 'validated')
  })

  it('affiche le statut brut si inconnu', () => {
    cy.mount(StatusBadge, { props: { status: 'archivé' } })
    cy.get('.badge').should('contain', 'archivé')
  })
})
*/