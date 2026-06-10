describe('CompetenceModal Component', () => {
  it('renders modal with correct title', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Nouvelle competence')
    cy.get('.modal-header p').should('contain', 'competence')
  })

  it('has all required form fields', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', 'Nom de la competence')
    cy.get('label').should('contain', 'Categorie')
    cy.get('label').should('contain', 'Niveau')
    cy.get('label').should('contain', 'Source')
  })

  it('category dropdown has correct options', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('select').first()
      .should('contain', 'Technique')
      .should('contain', 'Soft Skill')
      .should('contain', 'Langue')
  })

  it('submit button is disabled when form is empty', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when all fields are filled', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[placeholder*="React"]').type('Vue.js')
    cy.get('select').first().select('Technique')
    cy.get('input[type="number"]').type('85')
    cy.get('input[placeholder*="Projets"]').type('Certification')

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('level input accepts 0-100', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[type="number"]')
      .should('have.attr', 'min', '0')
      .should('have.attr', 'max', '100')
  })

  it('renders cancel button', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.cancel-btn').should('exist').should('contain', 'Annuler')
  })

  it('renders submit button with correct text', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.submit-btn').should('contain', 'Ajouter')
  })

  it('close button closes modal', () => {
    cy.mount({
      template: '<CompetenceModal @close="onClose" @save="onSave" />',
      components: { CompetenceModal: require('../../src/components/student/modals/CompetenceModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.close-btn').click()
  })
})
