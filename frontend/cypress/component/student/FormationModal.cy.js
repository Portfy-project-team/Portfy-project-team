describe('FormationModal Component', () => {
  it('renders with correct title for new formation', () => {
    cy.mount({
      template: '<FormationModal @close="onClose" @save="onSave" />',
      components: { FormationModal: require('../../src/components/student/modals/FormationModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Ajouter une formation')
  })

  it('renders with edit title when editing', () => {
    const formationToEdit = {
      id: 1,
      title: 'AWS Cloud',
      provider: 'AWS',
      label: 'Certification',
      progress: 100
    }

    cy.mount({
      template: '<FormationModal :formationToEdit="formation" @close="onClose" @save="onSave" />',
      components: { FormationModal: require('../../src/components/student/modals/FormationModal.vue').default },
      data() {
        return { formation: formationToEdit }
      },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Modifier la formation')
  })

  it('has all required form fields', () => {
    cy.mount({
      template: '<FormationModal @close="onClose" @save="onSave" />',
      components: { FormationModal: require('../../src/components/student/modals/FormationModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', 'Titre de la formation')
    cy.get('label').should('contain', 'Fournisseur')
    cy.get('label').should('contain', 'Type')
    cy.get('label').should('contain', 'Progression')
    cy.get('label').should('contain', 'Competences acquises')
  })

  it('validates form fields are required', () => {
    cy.mount({
      template: '<FormationModal @close="onClose" @save="onSave" />',
      components: { FormationModal: require('../../src/components/student/modals/FormationModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when all fields are filled', () => {
    cy.mount({
      template: '<FormationModal @close="onClose" @save="onSave" />',
      components: { FormationModal: require('../../src/components/student/modals/FormationModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[placeholder*="AWS"]').type('React Advanced')
    cy.get('input[placeholder*="Coursera"]').type('Udemy')
    cy.get('select').first().select('Certification')
    cy.get('input[type="number"]').type('85')

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('type dropdown has correct options', () => {
    cy.mount({
      template: '<FormationModal @close="onClose" @save="onSave" />',
      components: { FormationModal: require('../../src/components/student/modals/FormationModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('select').first().should('contain', 'Certification')
    cy.get('select').first().should('contain', 'MOOC')
    cy.get('select').first().should('contain', 'Formation')
  })

  it('progress input only accepts numbers 0-100', () => {
    cy.mount({
      template: '<FormationModal @close="onClose" @save="onSave" />',
      components: { FormationModal: require('../../src/components/student/modals/FormationModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[type="number"]')
      .should('have.attr', 'min', '0')
      .should('have.attr', 'max', '100')
  })

  it('cancel button emits close event', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/FormationModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.cancel-btn').click()
  })
})
