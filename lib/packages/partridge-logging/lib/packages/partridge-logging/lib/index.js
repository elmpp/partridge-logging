import winston from 'winston';
import { config } from 'partridge-config';
var transports = [new winston.transports.Console()];
if (config.logging.stackDriverEnable) {
    var LoggingWinston = require('@google-cloud/logging-winston').LoggingWinston;
    var loggingWinston = new LoggingWinston();
    transports.push(loggingWinston);
}
var logger = winston.createLogger({
    level: 'info',
    transports: transports,
});
logger.error('warp nacelles offline');
logger.info('shields at 99%');
export default logger;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map