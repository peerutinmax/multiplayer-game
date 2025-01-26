module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/test_backend.js', '<rootDir>/tests/unit/**/*.js', '<rootDir>/tests/system/**/*.js' ], // Target backend tests
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage/node',
  verbose: true,
};
