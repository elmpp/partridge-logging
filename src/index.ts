/**
 *  - google stackdriver logging - https://goo.gl/wcwLaK
 *  - winston - https://goo.gl/EPBvF3
 */

export {default as DumpableError} from './dumpable-error'
import {createLogger, format, transports as winstonTransports} from 'winston'
import {config} from 'partridge-config'
const {combine, timestamp, label, printf} = format
import debugFun, {IDebugger} from 'debug'
import {Logger} from './logger'
import {TransformableInfo} from 'logform'
import util from 'util'
import { LogOptions } from "./__types__"
import chalk from 'chalk'

export * from './__types__'

const debug: IDebugger = debugFun('logging:setup')
debug.log = console.log.bind(console) // https://goo.gl/KMfmSi

const runtimeLabel = (label: LogOptions['runtime_label']) => {
  switch (label) {
    case 'APOLLO':
      return chalk.green(`[${label}]`)
      case 'AXIOS':
      return chalk.yellow(`[${label}]`)
      case 'BOOTSTRAP':
      return chalk.blue(`[${label}]`)
      case 'EXPRESS':
      return chalk.magenta(`[${label}]`)
      case 'FRONTEND':
      return chalk.cyan(`[${label}]`)
      case 'IMPORTER':
      return chalk.red(`[${label}]`)
      case 'TYPEORM':
      return chalk.blueBright(`[${label}]`)
  }
  return `[${label}]`
}

const myFormat = printf((info: TransformableInfo) => { // this can be taken as a `LogOptions` 
  return `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${info.message}`
})

const myFormatWithDumpables = printf((info: TransformableInfo) => {
  if (info.dumpables) {
    return `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${info.message} dumpables: ${util.inspect(info.dumpables || {}, {showHidden: false, depth: null})}` // tslint:disable-line
  }
  return `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${info.message}`
})

const transports = new Map()

// use this simplistic check as webpack can analyze this. See DefinePlugin of `next.config.js`
if (process.env.APP_ENV !== 'browser') {
  const {LoggingWinston} = require('@google-cloud/logging-winston') // https://goo.gl/so8Afv

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
  // @TODO - remove myFormatWithDumpables once released
  transports.set('console', new winstonTransports.Console({format: myFormatWithDumpables}))
}

debug(`Logging: ${JSON.stringify({transports: [...transports.keys()], level: config.logging.level})}`)

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

logProvider.on('error', (err: Error) => { 
  logProvider.log('error', `Error during log provider call. Provider error msg: ${err.message}.`) // handles too-large grpc error
 })

const logger = new Logger(logProvider, config.logging.level as LogLevel)

export default logger

export {
  Logger,
}
