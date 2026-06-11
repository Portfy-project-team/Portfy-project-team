import ActivityModal from '@/components/student/modals/ActivityModal.vue'

describe('ActivityModal Component', () => {
  const mountComponent = (props = {}) => {
    const onClose = cy.stub().as('closeStub')
    const onSave = cy.stub().as('saveStub')

    cy.mount(ActivityModal, {
      props: {
        ...props,
        onClose,
        onSave,
      },
    })
  }

  const fillRequiredFields = () => {
    cy.get('input[placeholder*="Hackathon"]').type('Google DevFest')
    cy.get('input[placeholder*="Participant"]').type('Organizer')
    cy.get('select').first().select('Evenement')
    cy.get('input[placeholder*="ENSA"]').type('Google')
    cy.get('input[placeholder*="Mars"]').type('March 2025')
  }

  it('renders modal with title', () => {
    mountComponent()

    cy.get('.activity-modal h2').should('contain', 'Nouvelle activite')
    cy.get('.modal-header p').should('contain', 'club')
  })

  it('has all form fields', () => {
    mountComponent()

    cy.contains('label', "Nom de l'activite").should('exist')
    cy.contains('label', 'Role / participation').should('exist')
    cy.contains('label', "Type d'activite").should('exist')
    cy.contains('label', 'Organisation').should('exist')
    cy.contains('label', 'Periode').should('exist')
    cy.contains('label', 'Description').should('exist')
    cy.contains('label', 'Attestation / preuve').should('exist')
  })

  it('activity type dropdown has correct options', () => {
    mountComponent()

    cy.get('select')
      .first()
      .should('contain', 'Hackathon')
      .should('contain', 'Club')
      .should('contain', 'Evenement')
      .should('contain', 'Competition')
      .should('contain', 'Association')
  })

  it('submit button is disabled when form is empty', () => {
    mountComponent()

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when all required fields are filled', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('emits save event when submitting valid activity', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').click()

    cy.get('@saveStub').should('have.been.calledOnce')
    cy.get('@saveStub').should('have.been.calledWithMatch', {
      title: 'Google DevFest',
      role: 'Organizer',
      type: 'Evenement',
      organisation: 'Google',
      periode: 'March 2025',
      status: 'En attente',
    })
  })

  it('emits save event as draft', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.draft-btn').click()

    cy.get('@saveStub').should('have.been.calledOnce')
    cy.get('@saveStub').should('have.been.calledWithMatch', {
      status: 'Brouillon',
    })
  })

  it('hides draft button when editing', () => {
    mountComponent({
      activityToEdit: {
        id: 1,
        title: 'Existing Activity',
        role: 'Organizer',
        type: 'Club',
        organisation: 'ENSA',
        periode: '2025',
      },
    })

    cy.get('.activity-modal h2').should('contain', 'Modifier activite')
    cy.get('.draft-btn').should('not.exist')
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

  it('has proof file upload', () => {
    mountComponent()

    cy.get('input[type="file"]').should(
      'have.attr',
      'accept',
      'application/pdf, image/png, image/jpeg, image/jpg'
    )
  })

  it('has textarea for description', () => {
    mountComponent()

    cy.get('textarea').should(
      'have.attr',
      'placeholder',
      'Decrivez votre activite...'
    )
  })
})