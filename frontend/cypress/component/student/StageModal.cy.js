import StageModal from '@/components/student/modals/StageModal.vue'

describe('StageModal Component', () => {
  const mountComponent = (props = {}) => {
    const onClose = cy.stub().as('closeStub')
    const onSave = cy.stub().as('saveStub')

    cy.mount(StageModal, {
      props: {
        ...props,
        onClose,
        onSave,
      },
    })
  }

  const fillRequiredFields = () => {
    cy.get('input[placeholder*="OCP"]').type('Google')
    cy.get('input[placeholder*="Developpeur"]').type('Software Engineer')
    cy.get('input[placeholder*="Casablanca"]').type('London')
    cy.get('input[placeholder*="2 mois"]').type('1 month')
    cy.get('input[placeholder*="Juillet"]').type('June 2025 - July 2025')
  }

  it('renders with correct title for new stage', () => {
    mountComponent()

    cy.get('.modal-card h2').should('contain', 'Ajouter un stage')
    cy.get('.modal-header p').should('contain', 'professionnelle')
  })

  it('renders with edit title when editing', () => {
    mountComponent({
      stageToEdit: {
        id: 1,
        company: 'OCP',
        position: 'Developpeur',
        location: 'Casablanca',
        duration: '2 mois',
        period: 'Juillet 2024',
      },
    })

    cy.get('.modal-card h2').should('contain', 'Modifier le stage')
  })

  it('has all required form fields for stage', () => {
    mountComponent()

    cy.contains('label', "Organisme d'accueil").should('exist')
    cy.contains('label', 'Poste occupe').should('exist')
    cy.contains('label', 'Ville').should('exist')
    cy.contains('label', 'Duree').should('exist')
    cy.contains('label', 'Periode').should('exist')
    cy.contains('label', 'Missions realisees').should('exist')
    cy.contains('label', 'Technologies utilisees').should('exist')
    cy.contains('label', 'Encadrant entreprise').should('exist')
    cy.contains('label', 'Encadrant academique').should('exist')
  })

  it('submit button is disabled when required fields are empty', () => {
    mountComponent()

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when all required fields are filled', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('emits save event when submitting valid stage', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').click()

    cy.get('@saveStub').should('have.been.calledOnce')
    cy.get('@saveStub').should('have.been.calledWithMatch', {
      company: 'Google',
      position: 'Software Engineer',
      location: 'London',
      duration: '1 month',
      period: 'June 2025 - July 2025',
      status: 'En attente',
    })
  })

  it('shows save as draft button for new stage', () => {
    mountComponent()

    cy.get('.draft-btn')
      .should('exist')
      .should('contain', 'Enregistrer comme brouillon')
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
      stageToEdit: {
        id: 1,
        company: 'OCP',
        position: 'Developpeur',
        location: 'Casablanca',
        duration: '2 mois',
        period: 'Juillet 2024',
      },
    })

    cy.get('.draft-btn').should('not.exist')
  })

  it('has file upload section for report', () => {
    mountComponent()

    cy.contains('label', 'Rapport de stage').should('exist')
    cy.get('input[type="file"]').should('have.attr', 'accept', 'application/pdf')
  })

  it('has academic supervisor selector', () => {
    mountComponent()

    cy.get('select')
      .first()
      .should('contain', 'Pr. Benali')
      .should('contain', 'Pr. Idrissi')
      .should('contain', 'Pr. Rachid')
  })

  it('emits close event when close button clicked', () => {
    mountComponent()

    cy.get('.close-btn').click()
    cy.get('@closeStub').should('have.been.calledOnce')
  })
})