const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
});

// @openedx/frontend-build's default transformIgnorePatterns only covers @edx/ and @openedx/ scopes.
// We must expand it to include @2uinc/ packages which also ship untranspiled ESM.
config.transformIgnorePatterns = [
  '/node_modules/(?!@(open)?edx|@2uinc)',
];

module.exports = config;
