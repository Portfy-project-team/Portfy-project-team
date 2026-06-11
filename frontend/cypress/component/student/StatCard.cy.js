import StatCard from '@/components/student/StatCard.vue'

describe('StatCard Component', () => {
  it('renders with title and value', () => {
    cy.mount(StatCard, {
      props: {
        title: 'Projets',
        value: '12',
        unit: 'en cours',
        subtitle: '3 validés',
      },
    })

    cy.get('.stat-header h3').should('contain', 'Projets')
    cy.get('.value').should('contain', '12')
    cy.get('.unit').should('contain', 'en cours')
    cy.get('.stat-subtitle').should('contain', '3 validés')
  })

  it('applies green color classes', () => {
    cy.mount(StatCard, {
      props: {
        title: 'Formations',
        value: '5',
        color: 'green',
        subtitleColor: 'green',
        subtitle: 'Validé',
      },
    })

    cy.get('.stat-square').should('have.class', 'square-green')
    cy.get('.stat-subtitle').should('have.class', 'subtitle-green')
  })

  it('applies yellow and orange color classes', () => {
    cy.mount(StatCard, {
      props: {
        title: 'Stages',
        value: '2',
        color: 'yellow',
        subtitleColor: 'orange',
        subtitle: 'En attente',
      },
    })

    cy.get('.stat-square').should('have.class', 'square-yellow')
    cy.get('.stat-subtitle').should('have.class', 'subtitle-orange')
  })

  it('applies blue and gray color classes', () => {
    cy.mount(StatCard, {
      props: {
        title: 'Compétences',
        value: '18',
        color: 'blue',
        subtitleColor: 'gray',
        subtitle: 'Total',
      },
    })

    cy.get('.stat-square').should('have.class', 'square-blue')
    cy.get('.stat-subtitle').should('have.class', 'subtitle-gray')
  })

  it('renders card with default styling classes', () => {
    cy.mount(StatCard, {
      props: {
        title: 'Test',
        value: '100',
      },
    })

    cy.get('.stat-card').should('exist')
    cy.get('.stat-square').should('have.class', 'square-cream')
    cy.get('.stat-subtitle').should('have.class', 'subtitle-gray')
  })

  it('does not show unit when unit is empty', () => {
    cy.mount(StatCard, {
      props: {
        title: 'Test',
        value: '999',
        unit: '',
      },
    })

    cy.get('.value').should('contain', '999')
    cy.get('.unit').should('not.exist')
  })
})