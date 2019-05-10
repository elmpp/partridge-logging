"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dumpable_error_1 = require("./dumpable-error");
exports.DumpableError = dumpable_error_1.default;
const winston_1 = require("winston");
const partridge_config_1 = require("partridge-config");
const { combine, timestamp, label, printf } = winston_1.format;
const debug_1 = __importDefault(require("debug"));
const logger_1 = require("./logger");
exports.Logger = logger_1.Logger;
const util_1 = __importDefault(require("util"));
const chalk_1 = __importDefault(require("chalk"));
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
    }
    return `[${label}]`;
};
const myFormat = printf((info) => {
    return `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${info.message}`;
});
const myFormatWithDumpables = printf((info) => {
    if (info.dumpables) {
        return `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${info.message} dumpables: ${util_1.default.inspect(info.dumpables || {}, { showHidden: false, depth: null })}`;
    }
    return `${info.timestamp} ${info.runtime_label ? runtimeLabel(info.runtime_label) : ''} ${info.level}: ${info.message}`;
});
const transports = new Map();
if (process.env.CLIENT_SERVER !== 'client'
    && partridge_config_1.config.logging.stackDriverEnable) {
    const { LoggingWinston } = require('@google-cloud/logging-winston');
    const loggingWinstonIns = new LoggingWinston({
        projectId: partridge_config_1.config.environment.GCE_PROJECT_ID,
        keyFilename: partridge_config_1.config.environment.GCE_KEY_FILENAME,
        serviceContext: {
            service: '',
        },
    });
    transports.set('stackDriver', loggingWinstonIns);
}
if (partridge_config_1.config.logging.consoleEnable) {
    transports.set('console', new winston_1.transports.Console({ format: myFormatWithDumpables }));
}
debug(`Logging: ${JSON.stringify({ transports: [...transports.keys()], level: partridge_config_1.config.logging.level })}`);
const logProvider = winston_1.createLogger({
    format: combine(label({
        message: false,
    }), timestamp(), myFormat),
    level: partridge_config_1.config.logging.level,
    transports: [...transports.values()],
});
logProvider.on('error', (err) => {
    logProvider.log('error', `Error during log provider call. Provider error msg: ${err.message}.`);
});
const logger = new logger_1.Logger(logProvider, partridge_config_1.config.logging.level);
exports.default = logger;
//# sourceMappingURL=index.js.map