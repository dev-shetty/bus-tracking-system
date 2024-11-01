const baseConfig = require('../../eslint.base.config.js');
const typesBaseConfig = require('../../eslint.config.js');

module.exports = [...baseConfig, ...typesBaseConfig];
