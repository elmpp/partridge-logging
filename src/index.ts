// https://goo.gl/wcwLaK
import winston from 'winston'
import {config} from 'partridge-config'

const transports = [new winston.transports.Console()]

// the config will drive what transports we attach to our logging instance
if (config.logging.stackDriverEnable) {
  const {LoggingWinston} = require('@google-cloud/logging-winston')
  const loggingWinston = new LoggingWinston()

  // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
  transports.push(loggingWinston)
}

const logger = winston.createLogger({
  level: 'info',
  transports,
})

// Writes some log entries
logger.error('warp nacelles offline')
logger.info('shields at 99%')

export default logger