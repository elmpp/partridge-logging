import { LoggingProvider, LogOptions } from './__types__';
export declare class Logger {
    constructor(logProvider: LoggingProvider, defaultLogLevel: LogLevel);
    logProvider: LoggingProvider;
    defaultLogLevel: LogLevel;
    log(logLevel: LogLevel, message: string, options?: LogOptions): this;
    log(message: string, options?: LogOptions): this;
    log(logLevel: string, message: string): this;
    optionsReducer(options: LogOptions, logLevel: LogLevel): LogOptions;
}
//# sourceMappingURL=logger.d.ts.map