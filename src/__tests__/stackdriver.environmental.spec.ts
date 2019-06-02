/**
 * @jest-environment node
 */

/**
 * Writes some log entries to stackdriver (via fluentd)
 *
 * Note that in test:environmental, the server is brought up for us in the global jest-puppeteer hook via jest-dev-server
 * @see /jest-environmental.config and /jest-puppeteer.config.js
 */
import {config} from 'partridge-config'

jest.doMock('partridge-config', () => ({config: {...config, logging: {
  stackDriverEnable: true,
  consoleEnable: true,
  level: 'info',
}}}))

import logger from 'partridge-logging'
import { TransformableInfo } from 'logform';


describe('Stackdriver logging', () => {

  beforeAll(() => {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = config.environment.GCP_SERVICEACCOUNT_LOGGING
  })
  afterAll((done) => {
    logger.logProvider.on('finish', (_info: TransformableInfo) => {
      done()
    })
    logger.end()
  })
  
  it('should log a standard log entry', () => {

    logger.log('info', 'Test Message', {runtime_label: 'IMPORTER'})

    console.info("CHECK THE GKE LOGS OUTPUT (select 'Global') - https://goo.gl/jrpvzt")
  })
  
  it('should log a httpRequest like the logging middleware', () => {
    logger.log('info', '/stackdriver.environment.spec.ts endpoint hit', {
      httpRequest: {
        status: 200,
        requestUrl: 'http://bbc.com',
        requestMethod: 'GET',
        userAgent: 'fisher price kids tablet',
        remoteIp: '8.8.8.8',
        referer: 'http://suckit.com',
        cacheHit: 'SHIT',
      },
      runtime_label: 'EXPRESS',
    })
  })
  
  it('should log a structured log entry', () => {

    const structuredObject = {
      key: 'value',
      another_key: 'another_value',
    }
    logger.log('info', 'Test Message 2', {
      runtime_label: 'BOOTSTRAP',
      labels: {
        module: 'some-module'
      },
      dumpables: {testStructuredObject: [structuredObject]},
    })
    
    console.info("CHECK THE GKE LOGS OUTPUT (select \"Global\") -> json_payload.metadata[0]  - https://goo.gl/jrpvzt")
  })
  
  // Error reporting configuration - http://tinyurl.com/yxo9wcaz
  it('should be configured so error logs are picked up by StackDriver Error Reporting', () => {
    
    try {
      throw new Error("Test Error with stack trace")
    }
    catch (e) {
      logger.log('error', e)
    }

    console.info("CHECK THE ERROR REPORTING CONSOLE - http://tinyurl.com/y6sjh8ut")
  })
})
