describe('ProjectModal Component', () => {
  it('renders modal with title', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Ajouter un projet')
  })

  it('changes title when editing project', () => {
    const projectToEdit = { id: 1, title: 'Existing Project' }

    cy.mount({
      template: '<ProjectModal :projectToEdit="project" @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      data() {
        return { project: projectToEdit }
      },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Modifier le projet')
  })

  it('has all required form fields', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', 'Titre du projet')
    cy.get('label').should('contain', 'Description')
    cy.get('label').should('contain', 'Type de projet')
    cy.get('label').should('contain', 'Technologies')
    cy.get('label').should('contain', 'Lien GitHub')
    cy.get('label').should('contain', 'Captures')
  })

  it('project type dropdown has correct options', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('select').first()
      .should('contain', 'Projet de module')
      .should('contain', "Projet d'integration")
      .should('contain', 'Projet personnel')
  })

  it('submit button is disabled when form is empty', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when required fields are filled', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[placeholder*="API"]').type('E-commerce Platform')
    cy.get('textarea').first().type('A full-stack e-commerce application')
    cy.get('select').first().select('Projet personnel')
    cy.get('input[placeholder*="React"]').type('React, Node.js, MongoDB')

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('has screenshot upload field', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', 'Captures')
    cy.get('input[type="file"]').should('exist')
  })

  it('draft button visible for new project', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.draft-btn').should('exist')
  })

  it('has optional GitHub and demo links', () => {
    cy.mount({
      template: '<ProjectModal @close="onClose" @save="onSave" />',
      components: { ProjectModal: require('../../src/components/student/modals/ProjectModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[placeholder*="github"]').should('exist')
    cy.get('input[placeholder*="demo"]').should('exist')
  })
})
