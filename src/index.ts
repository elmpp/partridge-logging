/**
 *  - google stackdriver logging - https://goo.gl/wcwLaK
 *  - winston - https://goo.gl/EPBvF3
 */

import {createLogger, format, config as winstonConfig, transports as winstonTransports} from 'winston'
import {config} from 'partridge-config'
const {combine, timestamp, label, printf} = format

export * from './dumpable-error'

import debugFun, {IDebugger} from 'debug'
import {Logger} from './logger'
import {LogLevel} from './__types__'
import {TransformableInfo} from 'logform'

export {DumpableError} from './dumpable-error'

const debug: IDebugger = debugFun('logging:setup')
debug.log = console.log.bind(console) // https://goo.gl/KMfmSi

const myFormat = printf((info: TransformableInfo) => {
  return `${info.timestamp} ${info.runtime_label ? '[' + info.runtime_label + ']' : ''} ${info.level}: ${info.message}`
})

const transports = new Map()

// use this simplistic check as webpack can analyze this. See DefinePlugin of `next.config.js`
if (process.env.APP_ENV !== 'browser') {
  const {LoggingWinston} = require('@google-cloud/logging-winston')

  const loggingWinstonIns = new LoggingWinston({
    // options api - https://goo.gl/HBrj6a
    projectId: config.environment.GCE_PROJECT_ID,
    keyFilename: config.environment.GCE_KEY_FILENAME,
    serviceContext: {
      service: '',
    },
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
      message: false,
    }),
    timestamp(),
    myFormat
  ),
  level: config.logging.level,
  transports: [...transports.values()],
})

const logger = new Logger(logProvider, config.logging.level as LogLevel)

export default logger

export {Logger}
