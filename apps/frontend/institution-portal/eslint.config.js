const baseConfig = require('../../../eslint.base.config.js');
const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../../eslint.config.js');

module.exports = [
  ...baseConfig,

  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
