"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = __importDefault(require("./format"));
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
            options = optionsArg || {};
        }
        else {
            throw new dumpable_error_1.default('Unrecognised log calls', { logLevelOrMessage, messageOrOptions, optionsArg });
        }
        try {
            this.logProvider.log(logLevel, message, this.optionsReducer(options, logLevel));
        }
        catch (err) {
            this.logProvider.log('error', `Error during log provider call. Original msg: ${message}. Provider error msg: ${err.message}.`);
        }
        return this;
    }
    end() {
        this.logProvider.end();
    }
    optionsReducer(options, logLevel) {
        if (options.dumpables && Object.keys(options.dumpables).length !== 0) {
            options = Object.assign({}, options, { dumpables: lodash_mapvalues_1.default(options.dumpables, (dumpables, dumpableKey) => {
                    if (dumpables.length === 1) {
                        return format_1.default(dumpableKey, dumpables[0], logLevel);
                    }
                    return dumpables.map((dumpable) => format_1.default(dumpableKey, dumpable, logLevel));
                }) });
        }
        return options;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map