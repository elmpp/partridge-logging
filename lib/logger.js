var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import format from './formatters';
import { DumpableError } from './dumpable-error';
import mapValues from 'lodash.mapvalues';
export class Logger {
    constructor(logProvider, defaultLogLevel) {
        this.logProvider = logProvider;
        this.defaultLogLevel = defaultLogLevel;
    }
    log(logLevelOrMessage, messageOrOptions, optionsArg) {
        let logLevel = this.defaultLogLevel;
        let message;
        let options;
        if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
            message = logLevelOrMessage;
            options = messageOrOptions;
        }
        else if (typeof logLevelOrMessage === 'string' && typeof messageOrOptions === 'string') {
            logLevel = logLevelOrMessage;
            message = messageOrOptions;
            options = optionsArg;
        }
        else {
            throw new DumpableError('Unrecognised log calls', { logLevelOrMessage, messageOrOptions, optionsArg });
        }
        const { dumpables } = options, winstonOptions = __rest(options, ["dumpables"]);
        if (dumpables) {
            this.logProvider.log(Object.assign({ level: logLevel, message }, options));
            return this;
        }
        this.logProvider.log(Object.assign({ level: logLevel, message }, winstonOptions));
        return this;
    }
    dumpablesFormat(dumpables, logLevel) {
        const formatted = mapValues(dumpables, (dumpables, dumpableKey) => {
            if (dumpables.length === 1) {
                return format(dumpableKey, dumpables[0], logLevel);
            }
            return dumpables.map((dumpable) => format(dumpableKey, dumpable, logLevel));
        });
        return JSON.stringify(formatted);
    }
}
//# sourceMappingURL=logger.js.map