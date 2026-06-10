describe('StageModal Component', () => {
  it('renders with correct title for new stage', () => {
    cy.mount({
      template: '<StageModal @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Ajouter un stage')
    cy.get('.modal-header p').should('contain', 'professionnelle')
  })

  it('has all required form fields for stage', () => {
    cy.mount({
      template: '<StageModal @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', "Organisme d'accueil")
    cy.get('label').should('contain', 'Poste occupe')
    cy.get('label').should('contain', 'Ville')
    cy.get('label').should('contain', 'Periode')
    cy.get('label').should('contain', 'Missions')
    cy.get('label').should('contain', 'Encadrant')
  })

  it('submit button is disabled when required fields are empty', () => {
    cy.mount({
      template: '<StageModal @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when all required fields are filled', () => {
    cy.mount({
      template: '<StageModal @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[placeholder*="OCP"]').type('Google')
    cy.get('input[placeholder*="Développeur"]').type('Software Engineer')
    cy.get('input[placeholder*="Casablanca"]').type('London')
    cy.get('input[placeholder*="Juillet"]').type('June 2025 - July 2025')
    cy.get('input[placeholder*="2 mois"]').type('1 month')

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('shows save as draft button for new stage', () => {
    cy.mount({
      template: '<StageModal @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.draft-btn').should('exist').should('contain', 'Enregistrer comme brouillon')
  })

  it('hides draft button when editing', () => {
    const stageToEdit = {
      id: 1,
      company: 'OCP',
      position: 'Développeur'
    }

    cy.mount({
      template: '<StageModal :stageToEdit="stage" @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      data() {
        return { stage: stageToEdit }
      },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.draft-btn').should('not.exist')
  })

  it('has file upload section for report', () => {
    cy.mount({
      template: '<StageModal @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', 'Rapport de stage')
    cy.get('input[type="file"]').should('have.attr', 'accept', 'application/pdf')
  })

  it('has supervisor selectors', () => {
    cy.mount({
      template: '<StageModal @close="onClose" @save="onSave" />',
      components: { StageModal: require('../../src/components/student/modals/StageModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('select').should('have.length.at.least', 1)
  })
})
