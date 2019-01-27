// import winston from 'winston'
import winston from 'winston'
import * as StackDriverModule from '@google-cloud/logging-winston' // https://goo.gl/wcwLaK
import {Config} from 'partridge-config'
// import {Logger} from '../logger'
import * as LoggerModule from '../logger'

describe('partridge-logging-index', () => {
  
  let stackDriverTransportSpy: any
  let mockStackDriver: any
  let winstonCreateLoggerSpy: any
  let loggerSpy: jest.Mock<typeof LoggerModule.Logger>

  beforeEach(() => {
    mockStackDriver = new StackDriverModule.LoggingWinston()
    stackDriverTransportSpy = jest.fn(() => mockStackDriver)
    jest.spyOn(StackDriverModule, 'LoggingWinston').mockImplementation(stackDriverTransportSpy)
    winstonCreateLoggerSpy = jest.spyOn(winston, 'createLogger').mockImplementation(() => '__WINSTON_LOGGER')
    loggerSpy = jest.spyOn(LoggerModule, 'Logger').mockImplementation(() => ({clzMethod: '__LOGGER'}))
  })
  afterEach(() => {
    jest.resetModules() // lifesaver
  })

  it('attaches stackDriver transport when config specifies on when outside google cloud', () => {
    const mockConfig: Partial<Config> = {
      environment: {GCE_PROJECT_ID: 'partridge-alan', GCE_KEY_FILENAME: '/path/to/filename.json'},
      logging: {level: 'warn', stackDriverEnable: true, consoleEnable: false}
    }
    jest.doMock('partridge-config', () => ({config: mockConfig}))
    require('../index')
    
    expect(stackDriverTransportSpy).toHaveBeenCalledTimes(1)
    expect(stackDriverTransportSpy.mock.calls[0][0]).toEqual(expect.objectContaining({projectId: 'partridge-alan', keyFilename: '/path/to/filename.json'})) // https://goo.gl/GLPD4j
    expect(winstonCreateLoggerSpy.mock.calls[0][0].transports).toContain(mockStackDriver)
  })
  
  it('does not attach stackDriver transport when config specifies off', () => {
    const mockConfig: Partial<Config> = {
      environment: {GCE_PROJECT_ID: 'partridge-alan'},
      logging: {level: 'warn', stackDriverEnable: false, consoleEnable: false}
    }
    jest.doMock('partridge-config', () => ({config: mockConfig}))
    require('../index')
    
    expect(stackDriverTransportSpy).not.toHaveBeenCalled()
  })
  
  it('Creates Logger instance', () => {
    const mockConfig: Partial<Config> = {
      environment: {GCE_PROJECT_ID: 'partridge-alan'},
      logging: {level: 'warn', stackDriverEnable: false, consoleEnable: false}
    }
    jest.doMock('partridge-config', () => ({config: mockConfig}))
    
    require('../index')
    
    expect(loggerSpy.mock.calls[0][0]).toEqual('__WINSTON_LOGGER')
    expect(loggerSpy.mock.calls[0][1]).toEqual('warn')
  })
  
  // it("attaches console transport when config specifies on", () => {
  //   const mockConfig: Partial<Config> = {logging: {level: 'warn', stackDriverEnable: true, consoleEnable: true}}
  //   jest.doMock("partridge-config", () => ({config: mockConfig}))
  //   require("../index")

  //   console.log('winstonCreateLoggerSpy.mock.calls[0][0].transports :', winstonCreateLoggerSpy.mock.calls[0][0].transports.length);
  //   expect(winstonCreateLoggerSpy.mock.calls[0][0].transports[1]).toBeInstanceOf(winston.transports.Console)
  // })

})
