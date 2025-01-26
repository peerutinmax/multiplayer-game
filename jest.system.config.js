module.exports = {
    testEnvironment: 'node', // Or use 'jest-environment-jsdom' for frontend
    testMatch: ['**/tests/system/**/*.js'],  // Adjust based on your test file locations
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // Optional setup file
    collectCoverage: true,  // Enable coverage collection
    collectCoverageFrom: ["src/**/*.js"],  // Adjust to your source files location
    coverageReporters: ["json", "lcov", "text", "clover"],  // Formats for output
    coverageDirectory: "coverage",  // Where the coverage report will be stored
    testTimeout: 30000,  // Set appropriate timeout for Puppeteer
  };
  