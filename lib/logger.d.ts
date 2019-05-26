import { LoggingProvider, LogOptions } from './__types__';
export declare class Logger {
    constructor(logProvider: LoggingProvider, defaultLogLevel: LogLevel);
    logProvider: LoggingProvider;
    defaultLogLevel: LogLevel;
    log(logLevelOrMessage: string, messageOrOptions?: Error | string, optionsArg?: LogOptions): this;
    end(): void;
    optionsReducer(options: LogOptions, logLevel: LogLevel): LogOptions;
}
//# sourceMappingURL=logger.d.ts.map