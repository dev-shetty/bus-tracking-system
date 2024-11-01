const baseConfig = require('../../../eslint.base.config.js');
const apiBaseConfig = require('../../../eslint.config.js');

module.exports = [...baseConfig, ...apiBaseConfig];
