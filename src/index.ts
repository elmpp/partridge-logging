/**
 *  - google stackdriver logging - https://goo.gl/wcwLaK
 *  - winston - https://goo.gl/EPBvF3
 */

export {default as DumpableError} from './dumpable-error'
import {createLogger, format, transports as winstonTransports} from 'winston'
import { LEVEL, MESSAGE } from 'triple-beam'
import {config} from 'partridge-config'
import debugFun, {IDebugger} from 'debug'
import {Logger} from './logger'
import {TransformableInfo} from 'logform'
import util from 'util'
import {LogOptions} from './__types__'
import chalk from 'chalk'
import {Options as CloudWinstonOptions} from '@google-cloud/logging-winston/build/src/types/core'

export * from './__types__'

const {timestamp, label, printf} = format
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
    case 'GRAPHQL':
      return chalk.redBright(`[${label}]`)
  }
  return `[${label}]`
}

const myFormatWithDumpables = format.combine(
  // label({
  //   message: false,
  // }),
  timestamp(),
  format((info: TransformableInfo) => { // http://tinyurl.com/y5qwqb9s / inspired by https://tinyurl.com/yylgtvzl
    if (info instanceof Error) {
      const newinfo = Object.assign({}, info, {
        level: info.level,
        [LEVEL]: info[LEVEL] || info.level,
        message: info.message,
        [MESSAGE]: info[MESSAGE] || info.message
      }) // tslint:disable-line

      newinfo.stack = info.stack
      return newinfo
    }

    if (!((info as any).message instanceof Error)) return info

    // Assign all enumerable properties and the
    // message property from the error provided.
    Object.assign(info, info.message)

    const err = (info.message as unknown) as Error
    if (typeof err.message !== 'undefined') {
      info.message = err.message
      info[MESSAGE] = err.message;
    }

    // Assign the stack if requested.
    if (typeof err.stack !== 'undefined') {
      info.stack = err.stack
    }
    return info
  })(), // https://tinyurl.com/y2b4wf72
  printf((info: TransformableInfo) => {
    let formatted = `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${
      info.message
    }`

    if (info.stack) {
      formatted += `\n${info.stack}`
    }
    if (info.dumpables && Object.values(info.dumpables).length) {
      formatted += `\n dumpables: ${util.inspect(info.dumpables || {}, {showHidden: false, depth: null})}`
    }
    return formatted
  })
)

const transports = new Map()

// use this simplistic check as webpack can analyze this
if (
  process.env.CLIENT_SERVER !== 'client' && // @see DefinePlugin of `next.config.js`
  config.logging.LOGGING_STACKDRIVER_ENABLE
) {
  if (typeof process.env.APP_NAME === 'undefined' || typeof process.env.APP_VERSION === 'undefined') {
    throw new Error('APP_NAME and APP_VERSION must be present in env vars')
  }

  const {LoggingWinston} = require('@google-cloud/logging-winston') // http://tinyurl.com/y383a99v
  const cloudWinstonOptions: CloudWinstonOptions & {handleExceptions?: boolean} = {
    // Cloud Winston NodeJS logging transport configuration - http://tinyurl.com/y2g2xfdp
    projectId: config.environment.GCP_PROJECT_ID,
    keyFilename: config.environment.GCP_SERVICEACCOUNT_LOGGING, // service account deets - http://tinyurl.com/y364vhft
    serviceContext: {
      service: process.env.APP_NAME, // http://tinyurl.com/y58fxxtg
      version: process.env.APP_VERSION,
    },
    logName: process.env.APP_NAME,
    handleExceptions: true,
  }

  const loggingWinstonIns = new LoggingWinston(cloudWinstonOptions)

  debug(`StackDriver Options: ${JSON.stringify(cloudWinstonOptions)}`)

  // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log" on GKE
  transports.set('stackDriver', loggingWinstonIns)
}

if (config.logging.LOGGING_CONSOLE_ENABLE) {
  transports.set(
    'console',
    new winstonTransports.Console({
      handleExceptions: true,
    })
  )

  debug(`Logging: ${JSON.stringify({transports: [...transports.keys()], level: config.logging.LOGGING_LEVEL})}`)
} else {
  debug(`Logging: ${JSON.stringify({transports: [...transports.keys()], level: config.logging.LOGGING_LEVEL})}`)

  // include the console transport always as winston needs at least one
  transports.set('console', new winstonTransports.Console({silent: true}))
}

const logProvider = createLogger({
  level: config.logging.LOGGING_LEVEL,
  transports: [...transports.values()],
  format: myFormatWithDumpables,
  exitOnError: false,
})

// logProvider.on('error', (err: Error) => {
//   logProvider.log('error', `Error during log provider call. Provider error msg: ${err.message}.`) // handles too-large grpc error
// })

const logger = new Logger(logProvider, config.logging.LOGGING_LEVEL as LogLevel)

export default logger

export {Logger}
