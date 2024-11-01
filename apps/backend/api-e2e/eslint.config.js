const baseConfig = require('../../../eslint.base.config.js');
const apie2eBaseConfig = require('../../../eslint.config.js');

module.exports = [...baseConfig, ...apie2eBaseConfig];
