/**
 * Writes some log entries to stackdriver (via fluentd)
 *
 * Note that in test:functional, the server is brought up for us in the global jest-puppeteer hook via jest-dev-server
 * @see /jest-functional.config and /jest-puppeteer.config.js
 */
import {config} from 'partridge-config'

jest.doMock('partridge-config', () => ({config: {...config, logging: {
  stackDriverEnable: true,
  consoleEnable: true,
  level: 'info',
}}}))

import logger from 'partridge-logging'


describe('Stackdriver logging', () => {
  it('should log a standard log entry', () => {

    logger.log('info', 'Test Message', {label: 'TEST LABEL'})

    console.info("CHECK THE GKE LOGS OUTPUT (select \"Global\") - https://goo.gl/jrpvzt")
  })
  
  it('should log a structured log entry', () => {

    const structuredObject = {
      key: 'value',
      another_key: 'another_value',
    }
    logger.log('info', 'Test Message 2', {
      // runtime_label: 'TESTER_LABEL',
      labels: {
        module: 'some-module'
      },
      dumpables: {testStructuredObject: [structuredObject]},
    })

    console.info("CHECK THE GKE LOGS OUTPUT (select \"Global\") -> json_payload.metadata[0]  - https://goo.gl/jrpvzt")
  })
  
  // Needs to be set up on GKE once we create the cluster - https://goo.gl/F71ReC
  it('should be configuration so error logs are picked up by StackDriver Error Reporting', () => {

    expect(true).toEqual('need to add error reporting to GKE once cluster is up')
  })
})
