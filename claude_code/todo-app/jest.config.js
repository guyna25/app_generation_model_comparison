const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Unit tests config (React components, schemas)
const unitTestConfig = {
  displayName: 'unit',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/tests/unit/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

// Integration tests config (API routes with MongoDB)
const integrationTestConfig = {
  displayName: 'integration',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.integration.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/tests/integration/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

// Export config based on test pattern
module.exports = async () => {
  const nextJestConfig = await createJestConfig(unitTestConfig)();

  return {
    projects: [
      nextJestConfig,
      integrationTestConfig,
    ],
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/app/layout.tsx',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  };
};
