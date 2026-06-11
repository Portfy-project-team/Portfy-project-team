import StatusBadge from '@/components/student/StatusBadge.vue'

describe('StatusBadge Component', () => {
  it('displays valid status with correct class', () => {
    cy.mount(StatusBadge, {
      props: {
        status: 'Valide',
      },
    })

    cy.get('.status-badge')
      .should('have.class', 'status-valid')
      .should('contain', 'Valide')
  })

  it('displays certified status with valid class', () => {
    cy.mount(StatusBadge, {
      props: {
        status: 'Certifie',
      },
    })

    cy.get('.status-badge')
      .should('have.class', 'status-valid')
      .should('contain', 'Certifie')
  })

  it('displays pending status correctly', () => {
    cy.mount(StatusBadge, {
      props: {
        status: 'En attente',
      },
    })

    cy.get('.status-badge')
      .should('have.class', 'status-pending')
      .should('contain', 'En attente')
  })

  it('displays correction status correctly', () => {
    cy.mount(StatusBadge, {
      props: {
        status: 'Correction demandee',
      },
    })

    cy.get('.status-badge')
      .should('have.class', 'status-correction')
      .should('contain', 'Correction demandee')
  })

  it('displays draft status correctly', () => {
    cy.mount(StatusBadge, {
      props: {
        status: 'Brouillon',
      },
    })

    cy.get('.status-badge')
      .should('have.class', 'status-draft')
      .should('contain', 'Brouillon')
  })

  it('displays rejected status correctly', () => {
    cy.mount(StatusBadge, {
      props: {
        status: 'Refuse',
      },
    })

    cy.get('.status-badge')
      .should('have.class', 'status-rejected')
      .should('contain', 'Refuse')
  })

  it('displays default class for unknown status', () => {
    cy.mount(StatusBadge, {
      props: {
        status: 'Inconnu',
      },
    })

    cy.get('.status-badge')
      .should('have.class', 'status-default')
      .should('contain', 'Inconnu')
  })
})