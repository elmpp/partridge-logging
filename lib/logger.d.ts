import { LogLevel, LoggingProvider, Dumpables } from './__types__';
export interface LogOptions {
    dumpables?: Dumpables;
    runtime_label?: string;
    labels?: object;
    [index: string]: any;
}
export declare class Logger {
    constructor(logProvider: LoggingProvider, defaultLogLevel: LogLevel);
    logProvider: LoggingProvider;
    defaultLogLevel: LogLevel;
    log(logLevel: LogLevel, message: string, options?: LogOptions): this;
    log(message: string, options?: LogOptions): this;
    dumpablesFormat(dumpables: Dumpables, logLevel: LogLevel): string;
}
//# sourceMappingURL=logger.d.ts.map