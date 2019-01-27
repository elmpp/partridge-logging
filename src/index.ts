/**
 *  - google stackdriver logging - https://goo.gl/wcwLaK
 *  - winston - https://goo.gl/EPBvF3
 */ 
import {createLogger, format, transports as winstonTransports} from 'winston'
import {config} from 'partridge-config'
import {LoggingWinston} from '@google-cloud/logging-winston'
const {combine, timestamp, label, printf} = format

import debugFun, {IDebugger} from 'debug'
import { Logger } from './logger';
import { LogLevel } from './__types__';
const debug: IDebugger = debugFun('logging:setup')
debug.log = console.log.bind(console) // https://goo.gl/KMfmSi

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})

const transports = new Map()

if (config.logging.stackDriverEnable) {
  const loggingWinstonIns = new LoggingWinston({projectId: config.environment.GCE_PROJECT_ID, keyFilename: config.environment.GCE_KEY_FILENAME}) // options api - https://goo.gl/HBrj6a

  // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
  transports.set('stackDriver', loggingWinstonIns)

  // @todo add a stackdriver transport for facilitating stackdriver events
  // these will effectively do as an ELK-style system
}

if (config.logging.consoleEnable) {
  transports.set('console', new winstonTransports.Console())
}


debug(`Logging transports: ${JSON.stringify([...transports.keys()])}`)
const logProvider = createLogger({
  format: combine(
    // https://goo.gl/mF7Y2d
    label({ label: 'DEFAULT LABEL' }),
    timestamp(),
    myFormat
  ),
  level: config.logging.level,
  transports: [...transports.values()],
})

const logger = new Logger(logProvider, config.logging.level as LogLevel)

// // Writes some log entries
// logger.error('warp nacelles offline')
// logger.info('shields at 99%')

export default logger
// module.exports = logger