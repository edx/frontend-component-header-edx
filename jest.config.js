const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  testPathIgnorePatterns: [
    'dist/',
    'node_modules/',
  ],
});
