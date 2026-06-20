import js from "@eslint/js";

export default [
{
  ignores: [
    "dist/**",
    "cypress/**",
    "cypress.config.js"
  ]
},

  js.configs.recommended,

  {
    languageOptions: {
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        alert: "readonly",
        fetch: "readonly",
        history: "readonly",
        location: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
        localStorage: "readonly"
      }
    },

    rules: {
      "no-unused-vars": "warn"
    }
  },

  // Configuration Node.js pour cypress.config.js
  {
    files: ["cypress.config.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly"
      }
    }
  },

  // Configuration Cypress pour les tests
  {
  files: ["cypress/**/*.js"],
  languageOptions: {
    globals: {
      cy: "readonly",
      describe: "readonly",
      it: "readonly",
      before: "readonly",
      beforeEach: "readonly",
      after: "readonly",
      afterEach: "readonly",
      require: "readonly",
      module: "readonly",
      Cypress: "readonly",
      expect: "readonly"
    }
  }
}
];