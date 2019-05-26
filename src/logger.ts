import {LoggingProvider, Dumpable, DumpableKey, Dumpables, LogOptions} from './__types__'
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

  // log(logLevel: LogLevel, message: string, options?: LogOptions): this
  // log(message: string, options?: LogOptions): this
  // log(logLevel: string, message: string): this
  log(logLevelOrMessage: string, messageOrOptions?: Error | string, optionsArg?: LogOptions): this {
    let logLevel: LogLevel = this.defaultLogLevel
    let message: string | Error
    let options: LogOptions

    try {
      if (messageOrOptions instanceof Error) {
        logLevel = logLevelOrMessage as LogLevel
        message = messageOrOptions
        options = optionsArg || {}
      }
      // level is not supplied
      else if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
        message = logLevelOrMessage
        options = messageOrOptions
        // level and message supplied
      } else if (typeof logLevelOrMessage === 'string' && typeof messageOrOptions === 'string') {
        logLevel = logLevelOrMessage as LogLevel
        message = messageOrOptions
        options = optionsArg || {}
      } else {
        throw new DumpableError('Unrecognised log calls', {logLevelOrMessage: [logLevelOrMessage], messageOrOptions: [messageOrOptions], options: [optionsArg]})
      }

      this.logProvider.log(logLevel, message as string, this.optionsReducer(options, logLevel))
    }
    catch (err) {
      // note that this error handling is actually done in the .on('error') handler in logger index.ts
      // this.logProvider.error(err) // handles too-large grpc error
      this.logProvider.log('error', err) // handles too-large grpc error
    }

    return this
  }

  end() {
    this.logProvider.end() // http://tinyurl.com/yyo9v7p8
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
