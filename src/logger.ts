import {LoggingProvider, Dumpable, DumpableKey, LogOptions} from './__types__'
import format from './format'
import DumpableError from './dumpable-error'
import mapValues from 'lodash.mapvalues'


export class Logger {
  // readonly means it'll be assigned automatically to class property
  // constructor(readonly logProvider: LoggingProvider, readonly defaultLogLevel: LogLevel) {
  constructor(logProvider: LoggingProvider, defaultLogLevel: LogLevel) {
    this.logProvider = logProvider
    this.defaultLogLevel = defaultLogLevel
  }

  logProvider: LoggingProvider
  defaultLogLevel: LogLevel

  log(logLevel: LogLevel, message: string, options?: LogOptions): this
  log(message: string, options?: LogOptions): this
  log(logLevelOrMessage: any, messageOrOptions?: any, optionsArg?: any): this {
    let logLevel: LogLevel = this.defaultLogLevel
    let message: string
    let options: LogOptions

    // level is not supplied
    if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
      message = logLevelOrMessage
      options = messageOrOptions
      // level and message supplied
    } else if (typeof logLevelOrMessage === 'string' && typeof messageOrOptions === 'string') {
      logLevel = logLevelOrMessage as LogLevel
      message = messageOrOptions
      options = optionsArg
    } else {
      throw new DumpableError('Unrecognised log calls', {logLevelOrMessage, messageOrOptions, optionsArg})
    }

    this.logProvider.log(logLevel, message, this.optionsReducer(options, logLevel))
    return this
  }

  optionsReducer(options: LogOptions, logLevel: LogLevel): LogOptions {
    if (options.dumpables && Object.keys(options.dumpables).length !== 0) {
      options = {
        ...options,
        dumpables: mapValues(options.dumpables, (dumpables: Dumpable[], dumpableKey: DumpableKey) => {
          if (dumpables.length === 1) {
            return format(dumpableKey, dumpables[0], logLevel)
          }
          return dumpables.map((dumpable: Dumpable) => format(dumpableKey, dumpable, logLevel))
        })
      }
    }
    return options
  }
}
