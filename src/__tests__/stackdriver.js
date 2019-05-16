process.env.APP_NAME = 'partridge-manual-test'
process.env.APP_VERSION = '0.21'
process.env.NODE_ENV = 'production'

const {default: logger} = require('partridge-logging')

logger.log('warn', 'Test Message', {runtime_label: 'IMPORTER', label: 'TEST LABEL'})

