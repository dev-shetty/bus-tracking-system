const baseConfig = require('../../eslint.base.config.js');
const gpsParserBaseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,

  ...gpsParserBaseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
        },
      ],
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
  },
];
