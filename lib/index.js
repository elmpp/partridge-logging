import { createLogger, format, transports as winstonTransports } from 'winston';
import { config } from 'partridge-config';
const { combine, timestamp, label, printf } = format;
import debugFun from 'debug';
import { Logger } from './logger';
const debug = debugFun('logging:setup');
debug.log = console.log.bind(console);
const myFormat = printf((info) => {
    return `${info.timestamp} ${info.runtime_label ? '[' + info.runtime_label + ']' : ''} ${info.level}: ${info.message}`;
});
const transports = new Map();
if (process.env.APP_ENV !== 'browser') {
    const { LoggingWinston } = require('@google-cloud/logging-winston');
    const loggingWinstonIns = new LoggingWinston({
        projectId: config.environment.GCE_PROJECT_ID,
        keyFilename: config.environment.GCE_KEY_FILENAME,
        serviceContext: {
            service: ''
        }
    });
    transports.set('stackDriver', loggingWinstonIns);
}
if (config.logging.consoleEnable) {
    transports.set('console', new winstonTransports.Console());
}
debug(`Logging transports: ${JSON.stringify([...transports.keys()])}`);
const logProvider = createLogger({
    format: combine(label({
        message: false
    }), timestamp(), myFormat),
    level: config.logging.level,
    transports: [...transports.values()],
});
const logger = new Logger(logProvider, config.logging.level);
export default logger;
//# sourceMappingURL=index.js.map