"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatters_1 = __importDefault(require("./formatters"));
const dumpable_error_1 = __importDefault(require("./dumpable-error"));
const lodash_mapvalues_1 = __importDefault(require("lodash.mapvalues"));
class Logger {
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
            throw new dumpable_error_1.default('Unrecognised log calls', { logLevelOrMessage, messageOrOptions, optionsArg });
        }
        this.logProvider.log(logLevel, message, this.optionsReducer(options, logLevel));
        return this;
    }
    optionsReducer(options, logLevel) {
        if (options.dumpables && Object.keys(options.dumpables).length !== 0) {
            options = Object.assign({}, options, { dumpables: lodash_mapvalues_1.default(options.dumpables, (dumpables, dumpableKey) => {
                    if (dumpables.length === 1) {
                        return formatters_1.default(dumpableKey, dumpables[0], logLevel);
                    }
                    return dumpables.map((dumpable) => formatters_1.default(dumpableKey, dumpable, logLevel));
                }) });
        }
        return options;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map