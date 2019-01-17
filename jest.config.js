const base = require('../../jest.config.base.js')
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: './',
  testPathIgnorePatterns: ['\\.(orig.js)$', '\\.(skip.js)$'],
  setupTestFrameworkScriptFile: '<rootDir>../../jest.setup.js',
}
