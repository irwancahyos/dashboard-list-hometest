// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Use ts-jest for Typescript file
  preset: 'ts-jest',
  // Default environtment testing
  testEnvironment: 'jsdom', 
  // Jest file to find
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  moduleNameMapper: {
    // Alias in the ts config here
  },
  // skip node modules
  testPathIgnorePatterns: ['/node_modules/'],
};