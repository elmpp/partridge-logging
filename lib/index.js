"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const partridge_config_1 = require("partridge-config");
const { combine, timestamp, label, printf } = winston_1.format;
const debug_1 = __importDefault(require("debug"));
const logger_1 = require("./logger");
const debug = debug_1.default('logging:setup');
debug.log = console.log.bind(console);
const myFormat = printf((info) => {
    return `${info.timestamp} ${info.runtime_label ? '[' + info.runtime_label + ']' : ''} ${info.level}: ${info.message}`;
});
const transports = new Map();
if (process.env.APP_ENV !== 'browser') {
    const { LoggingWinston } = require('@google-cloud/logging-winston');
    const loggingWinstonIns = new LoggingWinston({
        projectId: partridge_config_1.config.environment.GCE_PROJECT_ID,
        keyFilename: partridge_config_1.config.environment.GCE_KEY_FILENAME,
        serviceContext: {
            service: ''
        }
    });
    transports.set('stackDriver', loggingWinstonIns);
}
if (partridge_config_1.config.logging.consoleEnable) {
    transports.set('console', new winston_1.transports.Console());
}
debug(`Logging transports: ${JSON.stringify([...transports.keys()])}`);
const logProvider = winston_1.createLogger({
    format: combine(label({
        message: false
    }), timestamp(), myFormat),
    level: partridge_config_1.config.logging.level,
    transports: [...transports.values()],
});
const logger = new logger_1.Logger(logProvider, partridge_config_1.config.logging.level);
exports.default = logger;
//# sourceMappingURL=index.js.map