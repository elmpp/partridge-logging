import { createLogger, format, transports as winstonTransports } from 'winston';
import { config } from 'partridge-config';
import { LoggingWinston } from '@google-cloud/logging-winston';
const { combine, timestamp, label, printf } = format;
import debugFun from 'debug';
import { Logger } from './logger';
const debug = debugFun('logging:setup');
debug.log = console.log.bind(console);
const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});
const transports = new Map();
if (config.logging.stackDriverEnable) {
    const loggingWinstonIns = new LoggingWinston();
    transports.set('stackDriver', loggingWinstonIns);
}
if (config.logging.consoleEnable) {
    transports.set('console', new winstonTransports.Console());
}
debug(`Logging transports: ${JSON.stringify([...transports.keys()])}`);
const logProvider = createLogger({
    format: combine(label({ label: 'DEFAULT LABEL' }), timestamp(), myFormat),
    level: config.logging.level,
    transports: [...transports.values()],
});
const logger = new Logger(logProvider, config.logging.level);
export default logger;
//# sourceMappingURL=index.js.map