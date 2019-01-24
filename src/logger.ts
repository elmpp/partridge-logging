import {LogLevel, LoggingProvider, Dumpables, Dumpable, DumpableKey} from './__types__'
import format from './formatters'
import * as util from 'util'
import {DumpableError} from './dumpable-error'

export class Logger {
  // readonly means it'll be assigned automatically to class property
  // constructor(readonly logProvider: LoggingProvider, readonly defaultLogLevel: LogLevel) {
  constructor(logProvider: LoggingProvider, defaultLogLevel: LogLevel) {
    this.logProvider = logProvider
    this.defaultLogLevel = defaultLogLevel
  }

  logProvider: LoggingProvider
  defaultLogLevel: LogLevel

  log(logLevel: LogLevel, message: string, dumpables?: Dumpables): this
  log(message: string, dumpables?: Dumpables): this
  log(logLevelOrMessage: any, messageOrDumpables?: any, dumpablesArg?: any): this {
    let logLevel: LogLevel = this.defaultLogLevel
    let message: string
    let dumpables: Dumpables

    // level is not supplied
    if (typeof messageOrDumpables === 'object' && messageOrDumpables !== null) {
      message = logLevelOrMessage
      dumpables = messageOrDumpables
      // level and message supplied
    } else if (typeof logLevelOrMessage === 'string' && typeof messageOrDumpables === 'string') {
      logLevel = logLevelOrMessage as LogLevel
      message = messageOrDumpables
      dumpables = dumpablesArg
    } else {
      throw new DumpableError('Unrecognised log calls', {logLevelOrMessage, messageOrDumpables, dumpablesArg})
    }

    if (dumpables) {
      this.logProvider.log({
        level: logLevel,
        message: util.format('%s ::: %s', message, this.dumpablesFormat(dumpables, logLevel)),
      })
      return this
    }

    this.logProvider.log({level: logLevel, message})
    return this
  }

  dumpablesFormat(dumpables: Dumpables, logLevel: LogLevel): string {
    return JSON.stringify(
      Object.keys(dumpables).map((dumpableKey: DumpableKey) => {
        const dumpable: Dumpable[] = dumpables[dumpableKey]!
        return dumpable.map((dumpable: Dumpable) => format(dumpableKey, dumpable, logLevel))
      })
    )
  }
}
