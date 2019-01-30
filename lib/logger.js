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
        this.logProvider.log(logLevel, message, Object.assign({}, options));
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