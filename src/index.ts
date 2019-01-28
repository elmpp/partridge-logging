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
import { TransformableInfo } from 'logform';
const debug: IDebugger = debugFun('logging:setup')
debug.log = console.log.bind(console) // https://goo.gl/KMfmSi

const myFormat = printf((info: TransformableInfo) => {
  return `${info.timestamp} ${info.runtime_label ? '[' + info.runtime_label + ']' : ''} ${info.level}: ${info.message}`
})

const transports = new Map()

if (config.logging.stackDriverEnable) {
  const loggingWinstonIns = new LoggingWinston({ // options api - https://goo.gl/HBrj6a
    projectId: config.environment.GCE_PROJECT_ID, 
    keyFilename: config.environment.GCE_KEY_FILENAME
  }) 

  // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log" on GKE
  transports.set('stackDriver', loggingWinstonIns)
}

if (config.logging.consoleEnable) {
  transports.set('console', new winstonTransports.Console())
}

debug(`Logging transports: ${JSON.stringify([...transports.keys()])}`)

const logProvider = createLogger({
  format: combine(
    // https://goo.gl/mF7Y2d
    label({ 
      // label: 'DEFAULT LABEL',
      message: false 
    }),
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