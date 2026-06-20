describe('LetterModal Component', () => {
  it('renders modal with title', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-card h2').should('contain', 'Demander une lettre')
    cy.get('.modal-header p').should('contain', 'recommandation')
  })

  it('has all required form fields', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('label').should('contain', 'Enseignant')
    cy.get('label').should('contain', 'Objet de la lettre')
    cy.get('label').should('contain', 'Objectif')
    cy.get('label').should('contain', 'Visibilite')
    cy.get('label').should('contain', 'Message')
  })

  it('submit button is disabled when form is empty', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.submit-btn').should('be.disabled')
  })

  it('submit button is enabled when form is valid', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('input[placeholder*="Pr."]').type('Pr. Mohamed Benali')
    cy.get('input[placeholder*="Candidature"]').type('Candidature Master')
    cy.get('select').first().select('Candidature Master')

    cy.get('.submit-btn').should('not.be.disabled')
  })

  it('emits close event when cancel button clicked', () => {
    const closeSpy = cy.spy()

    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose: closeSpy,
        onSave(data) {}
      }
    })

    cy.get('.cancel-btn').click()
  })

  it('purpose dropdown has correct options', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('select').first().as('purposeSelect')
    cy.get('@purposeSelect').should('contain', 'Candidature Master')
    cy.get('@purposeSelect').should('contain', 'Stage')
    cy.get('@purposeSelect').should('contain', 'Bourse')
  })

  it('visibility dropdown defaults to Privee', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('select').last().should('have.value', 'Privee')
  })

  it('modal closes on overlay click', () => {
    cy.mount({
      template: '<LetterModal @close="onClose" @save="onSave" />',
      components: { LetterModal: require('../../src/components/student/modals/LetterModal.vue').default },
      methods: {
        onClose() {},
        onSave(data) {}
      }
    })

    cy.get('.modal-overlay').click({ force: true })
  })
})
