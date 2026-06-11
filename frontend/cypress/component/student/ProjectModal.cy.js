import ProjectModal from '@/components/student/modals/ProjectModal.vue'

describe('ProjectModal Component', () => {
  const mountComponent = (props = {}) => {
    const onClose = cy.stub().as('closeStub')
    const onSave = cy.stub().as('saveStub')

    cy.mount(ProjectModal, {
      props: {
        ...props,
        onClose,
        onSave,
      },
    })
  }

  const fillRequiredFields = () => {
    cy.get('input[placeholder*="API"]').type('E-commerce Platform')
    cy.get('textarea').first().type('A full-stack e-commerce application')
    cy.get('select').first().select('Projet personnel')
    cy.get('input[placeholder*="React"]').type('React, Node.js, MongoDB')
  }

  it('renders modal with title', () => {
    mountComponent()

    cy.get('.project-modal h2').should('contain', 'Ajouter un projet')
  })

  it('changes title when editing project', () => {
    mountComponent({
      projectToEdit: {
        id: 1,
        title: 'Existing Project',
        description: 'Existing description',
        type: 'Projet personnel',
        tags: ['Vue.js'],
      },
    })

    cy.get('.project-modal h2').should('contain', 'Modifier le projet')
  })

  it('has all required form fields', () => {
    mountComponent()

    cy.contains('label', 'Titre du projet').should('exist')
    cy.contains('label', 'Description').should('exist')
    cy.contains('label', 'Type de projet').should('exist')
    cy.contains('label', 'Technologies utilisees').should('exist')
    cy.contains('label', 'Lien GitHub').should('exist')
    cy.contains('label', 'Lien de demo').should('exist')
    cy.contains('label', "Captures d'ecran").should('exist')
  })

  it('project type dropdown has correct options', () => {
    mountComponent()

    cy.get('select')
      .first()
      .should('contain', 'Projet de module')
      .should('contain', "Projet d'integration")
      .should('contain', 'Projet personnel')
      .should('contain', 'Projet de stage')
      .should('contain', 'Hackathon')
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

  it('emits save event when submitting valid project', () => {
    mountComponent()
    fillRequiredFields()

    cy.get('.submit-btn').click()

    cy.get('@saveStub').should('have.been.calledOnce')
    cy.get('@saveStub').should('have.been.calledWithMatch', {
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce application',
      type: 'Projet personnel',
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

  it('has screenshot upload field', () => {
    mountComponent()

    cy.get('input[type="file"]').should(
      'have.attr',
      'accept',
      'image/png, image/jpeg, image/jpg'
    )
  })

  it('draft button visible for new project', () => {
    mountComponent()

    cy.get('.draft-btn').should('exist').should('contain', 'Enregistrer brouillon')
  })

  it('hides draft button when editing', () => {
    mountComponent({
      projectToEdit: {
        id: 1,
        title: 'Existing Project',
        description: 'Description',
        type: 'Projet personnel',
        tags: ['Vue'],
      },
    })

    cy.get('.draft-btn').should('not.exist')
  })

  it('has optional GitHub and demo links', () => {
    mountComponent()

    cy.get('input[placeholder*="github.com"]').should('exist')
    cy.get('input[placeholder="https://..."]').should('exist')
  })

  it('emits close event when cancel button clicked', () => {
    mountComponent()

    cy.get('.cancel-btn').click()
    cy.get('@closeStub').should('have.been.calledOnce')
  })
})