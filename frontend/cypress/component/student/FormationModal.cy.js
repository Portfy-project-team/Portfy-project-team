import FormationModal from '@/components/student/modals/FormationModal.vue'

describe('FormationModal Component', () => {
  const mountComponent = (props = {}) => {
    const onClose = cy.stub().as('closeStub')
    const onSave = cy.stub().as('saveStub')

    cy.mount(FormationModal, {
      props: {
        ...props,
        onClose,
        onSave,
      },
    })
  }

  const fillRequiredFields = () => {
    cy.get('input[placeholder*="AWS"]').type('React Advanced')
    cy.get('input[placeholder*="Coursera"]').type('Udemy')
    cy.get('select').first().select('Certification')
    cy.get('input[type="number"]').type('85')
  }

  it('renders with correct title for new formation', () => {
    mountComponent()

    cy.get('.modal-card h2').should('contain', 'Ajouter une formation')
  })

  it('renders with edit title when editing', () => {
    mountComponent({
      formationToEdit: {
        id: 1,
        title: 'AWS Cloud',
        provider: 'AWS',
        label: 'Certification',
        progress: 100,
        tags: ['Cloud'],
      },
    })

    cy.get('.modal-card h2').should('contain', 'Modifier la formation')
  })

  it('has all required form fields', () => {
    mountComponent()

    cy.contains('label', 'Titre de la formation').should('exist')
    cy.contains('label', 'Fournisseur').should('exist')
    cy.contains('label', 'Type').should('exist')
    cy.contains('label', 'Progression').should('exist')
    cy.contains('label', 'Competences acquises').should('exist')
    cy.contains('label', 'Lien du certificat').should('exist')
  })

  it('submit button is disabled when form is empty', () => {
    mountComponent()

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when required fields are filled', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('emits save event with formation data', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').click()

    cy.get('@saveStub').should('have.been.calledOnce')
    cy.get('@saveStub').should('have.been.calledWithMatch', {
      title: 'React Advanced',
      provider: 'Udemy',
      label: 'Certification',
      progress: 85,
      status: 'Certifie',
    })
  })

  it('type dropdown has correct options', () => {
    mountComponent()

    cy.get('select')
      .first()
      .should('contain', 'Certification')
      .should('contain', 'MOOC')
      .should('contain', 'Formation')
  })

  it('progress input only accepts numbers 0-100', () => {
    mountComponent()

    cy.get('input[type="number"]')
      .should('have.attr', 'min', '0')
      .should('have.attr', 'max', '100')
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
})