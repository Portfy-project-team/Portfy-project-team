import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**"]
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
        setTimeout: "readonly"
      }
    },

    rules: {
      "no-unused-vars": "warn"
    }
  }
];