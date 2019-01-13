import winston from 'winston';
import { config } from 'partridge-config';
const transports = [new winston.transports.Console()];
if (config.get('logging.stackDriverEnable')) {
    const { LoggingWinston } = require('@google-cloud/logging-winston');
    const loggingWinston = new LoggingWinston();
    transports.push(loggingWinston);
}
const logger = winston.createLogger({
    level: 'info',
    transports,
});
logger.error('warp nacelles offline');
logger.info('shields at 99%');
export default logger;
//# sourceMappingURL=index.js.map