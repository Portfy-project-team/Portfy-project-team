// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// export default {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };




// export default {
//   preset: "ts-jest/presets/default-esm",
//   testEnvironment: "node",

//   setupFiles: ["<rootDir>/tests/setup.ts"],

//   extensionsToTreatAsEsm: [".ts"],

//   transform: {
//     "^.+\\.ts$": [
//       "ts-jest",
//       {
//         useESM: true,
//       },
//     ],
//   },

//   moduleNameMapper: {
//     "^(\\.{1,2}/.*)\\.js$": "$1",
//   },
// };


// jest.config.js
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testTimeout: 20000,
  setupFiles: ["<rootDir>/tests/setup.ts"],
  extensionsToTreatAsEsm: [".ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],  // ← AJOUT CRITIQUE
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      { useESM: true },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
// export default {
//   preset: "ts-jest/presets/default-esm",
//   testEnvironment: "node",
//   testTimeout: 20000,
//   setupFiles: ["<rootDir>/tests/setup.ts"],

//   extensionsToTreatAsEsm: [".ts"],

//   transform: {
//     "^.+\\.ts$": [
//       "ts-jest",
//       {
//         useESM: true,
//       },
//     ],
//   },

//   moduleNameMapper: {
//     "^(\\.{1,2}/.*)\\.js$": "$1",
//   },
// };




// export default {
//   preset: "ts-jest/presets/default-esm",
//   testEnvironment: "node",

//   extensionsToTreatAsEsm: [".ts"],

//   transform: {
//     "^.+\\.tsx?$": [
//       "ts-jest",
//       {
//         useESM: true,
//       },
//     ],
//   },

//   moduleNameMapper: {
//     "^(\\.{1,2}/.*)\\.js$": "$1",
//   },
// };

// export default {
//   preset: "ts-jest/presets/default-esm",
//   testEnvironment: "node",

//   extensionsToTreatAsEsm: [".ts"],

//   transform: {
//     "^.+\\.ts$": [
//       "ts-jest",
//       {
//         useESM: true,
//       },
//     ],
//   },

//   moduleNameMapper: {
//     "^(\\.{1,2}/.*)\\.js$": "$1",
//   },
// };
// export default {
//   preset: "ts-jest/presets/default-esm",
//   testEnvironment: "node",

//   extensionsToTreatAsEsm: [".ts"],

//   moduleNameMapper: {
//     "^(\\.{1,2}/.*)\\.js$": "$1",
//   },
// };








// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testMatch: ['**/tests/**/*.test.ts'],
// };
// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testMatch: ['**/tests/**/*.test.ts'],
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   },
// };

// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   globals: {
//     'ts-jest': {
//       tsconfig: 'tsconfig.json',
//     },
//   },
// };


// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// };

// export default {
//   preset: 'ts-jest/presets/default-esm',
//   testEnvironment: 'node',

//   extensionsToTreatAsEsm: ['.ts'],

//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   },

//   transform: {},
// };