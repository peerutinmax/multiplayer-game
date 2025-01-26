module.exports = {
    testEnvironment: 'node', // Or use 'jest-environment-jsdom' for frontend
    testMatch: ['**/tests/system/**/*.js'],  // Adjust based on your test file locations
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // Optional setup file
    testTimeout: 30000,  // Set appropriate timeout for Puppeteer
  };
  