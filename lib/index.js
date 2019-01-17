import winston from 'winston';
import { config } from 'partridge-config';
import debugFun from 'debug';
const debug = debugFun('logging:setup');
debug.log = console.log.bind(console);
const transports = new Map();
if (config.logging.stackDriverEnable) {
    const { LoggingWinston } = require('@google-cloud/logging-winston');
    const loggingWinston = new LoggingWinston();
    transports.set('stackDriver', loggingWinston);
}
if (config.logging.consoleEnable) {
    transports.set('console', new winston.transports.Console({
        format: winston.format.simple()
    }));
}
debug(`Logging transports: ${JSON.stringify([...transports.keys()])}`);
const logger = winston.createLogger({
    level: 'info',
    transports: [...transports.values()],
});
export default logger;
//# sourceMappingURL=index.js.map