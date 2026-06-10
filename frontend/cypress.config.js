const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'frontend-project',

  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    env: {
      professor_email: 'professor@test.com',
      professor_password: 'password123',
      admin_email: 'admin@test.com',
      admin_password: 'admin123',
      student_email: 'student@test.com',
      student_password: 'student123',
      apiUrl: 'http://localhost:3000/api',
    },

    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        clearDatabase() {
          // Hook pour reset DB si nécessaire
          return null
        },
      })
      return config
    },
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.js',
    supportFile: 'cypress/support/component.js',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
})