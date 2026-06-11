import CompetenceModal from '@/components/student/modals/CompetenceModal.vue'

describe('CompetenceModal Component', () => {
  const mountComponent = () => {
    const onClose = cy.stub().as('closeStub')
    const onSave = cy.stub().as('saveStub')

    cy.mount(CompetenceModal, {
      props: {
        onClose,
        onSave,
      },
    })
  }

  const fillRequiredFields = () => {
    cy.get('input[placeholder*="React"]').type('Vue.js')
    cy.get('select').first().select('Technique')
    cy.get('input[type="number"]').type('85')
    cy.get('input[placeholder*="Projets"]').type('Certification')
  }

  it('renders modal with correct title', () => {
    mountComponent()

    cy.get('.modal-card h2').should('contain', 'Nouvelle competence')
    cy.get('.modal-header p').should('contain', 'competence')
  })

  it('has all required form fields', () => {
    mountComponent()

    cy.contains('label', 'Nom de la competence').should('exist')
    cy.contains('label', 'Categorie').should('exist')
    cy.contains('label', 'Niveau').should('exist')
    cy.contains('label', 'Source / preuve').should('exist')
  })

  it('category dropdown has correct options', () => {
    mountComponent()

    cy.get('select')
      .first()
      .should('contain', 'Technique')
      .should('contain', 'Soft Skill')
      .should('contain', 'Langue')
  })

  it('submit button is disabled when form is empty', () => {
    mountComponent()

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when all fields are filled', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('emits save event with competence data', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').click()

    cy.get('@saveStub').should('have.been.calledOnce')
    cy.get('@saveStub').should('have.been.calledWithMatch', {
      name: 'Vue.js',
      level: 85,
      category: 'Technique',
      source: 'Certification',
    })
  })

  it('level input accepts 0-100', () => {
    mountComponent()

    cy.get('input[type="number"]')
      .should('have.attr', 'min', '0')
      .should('have.attr', 'max', '100')
  })

  it('renders cancel button', () => {
    mountComponent()

    cy.get('.cancel-btn').should('exist').should('contain', 'Annuler')
  })

  it('renders submit button with correct text', () => {
    mountComponent()

    cy.get('.submit-btn').should('contain', 'Ajouter')
  })

  it('emits close event when close button clicked', () => {
    mountComponent()

    cy.get('.close-btn').click()
    cy.get('@closeStub').should('have.been.calledOnce')
  })

  it('emits close event when cancel button clicked', () => {
    mountComponent()

    cy.get('.cancel-btn').click()
    cy.get('@closeStub').should('have.been.calledOnce')
  })
})