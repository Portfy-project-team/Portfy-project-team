import LetterModal from '@/components/student/modals/LetterModal.vue'

describe('LetterModal Component', () => {
  const mountComponent = () => {
    const onClose = cy.stub().as('closeStub')
    const onSave = cy.stub().as('saveStub')

    cy.mount(LetterModal, {
      props: {
        onClose,
        onSave,
      },
    })
  }

  const fillRequiredFields = () => {
    cy.get('input[placeholder*="Pr."]').type('Pr. Mohamed Benali')
    cy.get('input[placeholder*="Candidature"]').type('Candidature Master')
    cy.get('select').first().select('Candidature Master')
  }

  it('renders modal with title', () => {
    mountComponent()

    cy.get('.modal-card h2').should('contain', 'Demander une lettre')
    cy.get('.modal-header p').should('contain', 'recommandation')
  })

  it('has all required form fields', () => {
    mountComponent()

    cy.contains('label', 'Enseignant').should('exist')
    cy.contains('label', 'Objet de la lettre').should('exist')
    cy.contains('label', 'Objectif').should('exist')
    cy.contains('label', 'Visibilite').should('exist')
    cy.contains('label', 'Message').should('exist')
  })

  it('submit button is disabled when form is empty', () => {
    mountComponent()

    cy.get('.submit-btn').should('be.disabled')
  })

  it('submit button is enabled when form is valid', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('emits save event when form is submitted', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').click()

    cy.get('@saveStub').should('have.been.calledOnce')
    cy.get('@saveStub').should('have.been.calledWithMatch', {
      professor: 'Pr. Mohamed Benali',
      object: 'Candidature Master',
      purpose: 'Candidature Master',
      visibility: 'Privee',
      status: 'En attente',
    })
  })

  it('emits close event when cancel button clicked', () => {
    mountComponent()

    cy.get('.cancel-btn').click()
    cy.get('@closeStub').should('have.been.calledOnce')
  })

  it('emits close event when close button clicked', () => {
    mountComponent()

    cy.get('.close-btn').click()
    cy.get('@closeStub').should('have.been.calledOnce')
  })

  it('purpose dropdown has correct options', () => {
    mountComponent()

    cy.get('select').first().as('purposeSelect')
    cy.get('@purposeSelect').should('contain', 'Candidature Master')
    cy.get('@purposeSelect').should('contain', 'Stage')
    cy.get('@purposeSelect').should('contain', 'Double diplomation')
    cy.get('@purposeSelect').should('contain', 'Bourse')
    cy.get('@purposeSelect').should('contain', 'Emploi')
  })

  it('visibility dropdown defaults to Privee', () => {
    mountComponent()

    cy.get('select').last().should('have.value', 'Privee')
  })

  it('emits close event when overlay clicked', () => {
    mountComponent()

    cy.get('.modal-overlay').click('topLeft')
    cy.get('@closeStub').should('have.been.calledOnce')
  })
})