module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [ '<rootDir>/tests/integration/test_frontend.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage/jsdom',
  collectCoverageFrom: ['<rootDir>/public/js/**/*.js'],
  verbose: true,
};
