import { LogLevel, LoggingProvider, Dumpables } from './__types__';
export interface LogOptions {
    dumpables?: Dumpables;
    runtime_label?: 'APOLLO' | 'BOOTSTRAP' | 'AXIOS';
    labels?: object;
    [index: string]: any;
}
export declare class Logger {
    constructor(logProvider: LoggingProvider, defaultLogLevel: LogLevel);
    logProvider: LoggingProvider;
    defaultLogLevel: LogLevel;
    log(logLevel: LogLevel, message: string, options?: LogOptions): this;
    log(message: string, options?: LogOptions): this;
    optionsReducer(options: LogOptions, logLevel: LogLevel): LogOptions;
}
//# sourceMappingURL=logger.d.ts.map