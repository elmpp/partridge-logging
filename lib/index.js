"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dumpable_error_1 = require("./dumpable-error");
exports.DumpableError = dumpable_error_1.default;
const winston_1 = require("winston");
const triple_beam_1 = require("triple-beam");
const partridge_config_1 = require("partridge-config");
const debug_1 = __importDefault(require("debug"));
const logger_1 = require("./logger");
exports.Logger = logger_1.Logger;
const util_1 = __importDefault(require("util"));
const chalk_1 = __importDefault(require("chalk"));
const { timestamp, label, printf } = winston_1.format;
const debug = debug_1.default('logging:setup');
debug.log = console.log.bind(console);
const runtimeLabel = (label) => {
    switch (label) {
        case 'APOLLO':
            return chalk_1.default.green(`[${label}]`);
        case 'AXIOS':
            return chalk_1.default.yellow(`[${label}]`);
        case 'BOOTSTRAP':
            return chalk_1.default.blue(`[${label}]`);
        case 'EXPRESS':
            return chalk_1.default.magenta(`[${label}]`);
        case 'FRONTEND':
            return chalk_1.default.cyan(`[${label}]`);
        case 'IMPORTER':
            return chalk_1.default.red(`[${label}]`);
        case 'TYPEORM':
            return chalk_1.default.blueBright(`[${label}]`);
        case 'GRAPHQL':
            return chalk_1.default.redBright(`[${label}]`);
    }
    return `[${label}]`;
};
const myFormatWithDumpables = winston_1.format.combine(timestamp(), winston_1.format((info) => {
    if (info instanceof Error) {
        const newinfo = Object.assign({}, info, {
            level: info.level,
            [triple_beam_1.LEVEL]: info[triple_beam_1.LEVEL] || info.level,
            message: info.message,
            [triple_beam_1.MESSAGE]: info[triple_beam_1.MESSAGE] || info.message
        });
        newinfo.stack = info.stack;
        return newinfo;
    }
    if (!(info.message instanceof Error))
        return info;
    Object.assign(info, info.message);
    const err = info.message;
    if (typeof err.message !== 'undefined') {
        info.message = err.message;
        info[triple_beam_1.MESSAGE] = err.message;
    }
    if (typeof err.stack !== 'undefined') {
        info.stack = err.stack;
    }
    return info;
})(), printf((info) => {
    let formatted = `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${info.message}`;
    if (info.stack) {
        formatted += `\n${info.stack}`;
    }
    if (info.dumpables && Object.values(info.dumpables).length) {
        formatted += `\n dumpables: ${util_1.default.inspect(info.dumpables || {}, { showHidden: false, depth: null })}`;
    }
    return formatted;
}));
const transports = new Map();
if (process.env.CLIENT_SERVER !== 'client' &&
    partridge_config_1.config.logging.LOGGING_STACKDRIVER_ENABLE) {
    if (typeof process.env.APP_NAME === 'undefined' || typeof process.env.APP_VERSION === 'undefined') {
        throw new Error('APP_NAME and APP_VERSION must be present in env vars');
    }
    const { LoggingWinston } = require('@google-cloud/logging-winston');
    const cloudWinstonOptions = {
        projectId: partridge_config_1.config.environment.GCP_PROJECT_ID,
        keyFilename: partridge_config_1.config.environment.GCP_SERVICEACCOUNT_LOGGING,
        serviceContext: {
            service: process.env.APP_NAME,
            version: process.env.APP_VERSION,
        },
        logName: process.env.APP_NAME,
        handleExceptions: true,
    };
    const loggingWinstonIns = new LoggingWinston(cloudWinstonOptions);
    debug(`StackDriver Options: ${JSON.stringify(cloudWinstonOptions)}`);
    transports.set('stackDriver', loggingWinstonIns);
}
if (partridge_config_1.config.logging.LOGGING_CONSOLE_ENABLE) {
    transports.set('console', new winston_1.transports.Console({
        handleExceptions: true,
    }));
    debug(`Logging: ${JSON.stringify({ transports: [...transports.keys()], level: partridge_config_1.config.logging.LOGGING_LEVEL })}`);
}
else {
    debug(`Logging: ${JSON.stringify({ transports: [...transports.keys()], level: partridge_config_1.config.logging.LOGGING_LEVEL })}`);
    transports.set('console', new winston_1.transports.Console({ silent: true }));
}
const logProvider = winston_1.createLogger({
    level: partridge_config_1.config.logging.LOGGING_LEVEL,
    transports: [...transports.values()],
    format: myFormatWithDumpables,
    exitOnError: false,
});
const logger = new logger_1.Logger(logProvider, partridge_config_1.config.logging.LOGGING_LEVEL);
exports.default = logger;
//# sourceMappingURL=index.js.map