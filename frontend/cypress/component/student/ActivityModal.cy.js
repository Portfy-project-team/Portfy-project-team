describe('ActivityModal Component', () => {
  it('renders modal with title', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Nouvelle activite')
  })

  it('has all form fields', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', "Nom de l'activite")
    cy.get('label').should('contain', 'Role / participation')
    cy.get('label').should('contain', "Type d'activite")
    cy.get('label').should('contain', 'Organisation')
    cy.get('label').should('contain', 'Periode')
    cy.get('label').should('contain', 'Description')
    cy.get('label').should('contain', 'Attestation')
  })

  it('activity type dropdown has correct options', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('select').first()
      .should('contain', 'Hackathon')
      .should('contain', 'Club')
      .should('contain', 'Evenement')
      .should('contain', 'Competition')
  })

  it('validates required fields', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.submit-btn').should('be.disabled')
  })

  it('enables submit when all required fields are filled', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[placeholder*="Hackathon"]').type('Google DevFest')
    cy.get('input[placeholder*="Participant"]').type('Organizer')
    cy.get('select').first().select('Evenement')
    cy.get('input[placeholder*="ENSA"]').type('Google')
    cy.get('input[placeholder*="Mars"]').type('March 2025')

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('has draft button for new activity', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.draft-btn').should('contain', 'Enregistrer brouillon')
  })

  it('hides draft button when editing', () => {
    const activityToEdit = { id: 1, title: 'Existing Activity' }

    cy.mount({
      template: '<ActivityModal :activityToEdit="activity" @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      data() {
        return { activity: activityToEdit }
      },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.draft-btn').should('not.exist')
  })

  it('has proof file upload', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[type="file"]').should('have.attr', 'accept', 'application/pdf, image/png, image/jpeg, image/jpg')
  })

  it('has textarea for description', () => {
    cy.mount({
      template: '<ActivityModal @close="onClose" @save="onSave" />',
      components: { ActivityModal: require('../../src/components/student/modals/ActivityModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('textarea').should('have.attr', 'placeholder', 'Decrivez votre activite...')
  })
})
