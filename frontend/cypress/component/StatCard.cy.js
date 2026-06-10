describe('StatCard Component', () => {
  it('renders with title and value', () => {
    cy.mount({
      template: '<StatCard title="Projets" value="12" unit="en cours" subtitle="3 validés" />',
      components: { StatCard: require('../../src/components/student/StatCard.vue').default }
    })

    cy.get('.stat-header h3').should('contain', 'Projets')
    cy.get('.value').should('contain', '12')
    cy.get('.unit').should('contain', 'en cours')
    cy.get('.stat-subtitle').should('contain', '3 validés')
  })

  it('applies correct color class', () => {
    cy.mount({
      template: '<StatCard title="Formations" value="5" color="green" subtitleColor="green" />',
      components: { StatCard: require('../../src/components/student/StatCard.vue').default }
    })

    cy.get('.square-green').should('exist')
    cy.get('.subtitle-green').should('exist')
  })

  it('applies yellow color styling', () => {
    cy.mount({
      template: '<StatCard title="Stages" value="2" color="yellow" subtitleColor="orange" />',
      components: { StatCard: require('../../src/components/student/StatCard.vue').default }
    })

    cy.get('.square-yellow').should('exist')
    cy.get('.subtitle-orange').should('exist')
  })

  it('applies blue color styling', () => {
    cy.mount({
      template: '<StatCard title="Compétences" value="18" color="blue" subtitleColor="gray" />',
      components: { StatCard: require('../../src/components/student/StatCard.vue').default }
    })

    cy.get('.square-blue').should('exist')
    cy.get('.subtitle-gray').should('exist')
  })

  it('renders card with proper styling', () => {
    cy.mount({
      template: '<StatCard title="Test" value="100" />',
      components: { StatCard: require('../../src/components/student/StatCard.vue').default }
    })

    cy.get('.stat-card')
      .should('have.css', 'border-radius', '16px')
      .should('have.css', 'background', 'rgb(255, 255, 255)')
  })

  it('displays large font for value', () => {
    cy.mount({
      template: '<StatCard title="Test" value="999" />',
      components: { StatCard: require('../../src/components/student/StatCard.vue').default }
    })

    cy.get('.value').should('have.css', 'font-size', '34px')
  })
})
