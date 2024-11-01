const baseConfig = require('../../../eslint.base.config.js');
const nx = require('@nx/eslint-plugin');
const institutionBaseConfig = require('../../../eslint.config.js');

module.exports = [
  ...baseConfig,

  ...institutionBaseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
