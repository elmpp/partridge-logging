import { LogLevel, LoggingProvider, Dumpables } from './__types__';
interface LogOptions {
    dumpables?: Dumpables;
    label: string;
}
export declare class Logger {
    constructor(logProvider: LoggingProvider, defaultLogLevel: LogLevel);
    logProvider: LoggingProvider;
    defaultLogLevel: LogLevel;
    log(logLevel: LogLevel, message: string, options?: LogOptions): this;
    log(message: string, options?: LogOptions): this;
    dumpablesFormat(dumpables: Dumpables, logLevel: LogLevel): string;
}
export {};
//# sourceMappingURL=logger.d.ts.map