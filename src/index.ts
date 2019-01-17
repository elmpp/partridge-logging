// https://goo.gl/wcwLaK
import winston from 'winston'
import {config} from 'partridge-config'

import debugFun, { IDebugger } from 'debug'
const debug: IDebugger = debugFun('logging:setup')
debug.log = console.log.bind(console) // https://goo.gl/KMfmSi

const transports = new Map()

// the config will drive what transports we attach to our logging instance
if (config.logging.stackDriverEnable) {
  const {LoggingWinston} = require('@google-cloud/logging-winston')
  const loggingWinston = new LoggingWinston()

  // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
  transports.set('stackDriver', loggingWinston)
}

if (config.logging.consoleEnable) {
  transports.set('console', new winston.transports.Console({
    format: winston.format.simple()
  }))
}

debug(`Logging transports: ${JSON.stringify([...transports.keys()])}`)

const logger = winston.createLogger({
  level: 'info',
  transports: [...transports.values()],
})

// // Writes some log entries
// logger.error('warp nacelles offline')
// logger.info('shields at 99%')

export default logger
