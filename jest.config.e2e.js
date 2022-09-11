// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  testRegex: '\\.e2e-spec\\.ts$',
  coverageDirectory: './coverage/e2e',
  globalSetup: './test/setup/index.ts',
};
