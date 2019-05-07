import winston from 'winston'
import * as StackDriverModule from '@google-cloud/logging-winston' // https://goo.gl/wcwLaK
import {Config} from 'partridge-config'
import * as LoggerModule from '../logger'

describe('partridge-logging-index', () => {
  
  let stackDriverTransportSpy: any
  let mockStackDriver: any
  let winstonCreateLoggerSpy: any
  let loggerSpy: jest.Mock<typeof LoggerModule.Logger>
  const loggerOnMock = jest.fn()

  beforeEach(() => {
    mockStackDriver = new StackDriverModule.LoggingWinston()
    stackDriverTransportSpy = jest.fn(() => mockStackDriver)
    // jest.spyOn(StackDriverModule, 'LoggingWinston').mockImplementation(stackDriverTransportSpy)
    jest.mock('@google-cloud/logging-winston', () => ({LoggingWinston: stackDriverTransportSpy}))
    winstonCreateLoggerSpy = jest.spyOn(winston, 'createLogger').mockImplementation(() => ({on: jest.fn()} as unknown as winston.Logger))
    // loggerSpy = jest.spyOn(LoggerModule, 'Logger').mockImplementation(() => ({clzMethod: '__LOGGER'}))
    // loggerSpy = jest.mock('../logger', () => ({Logger: () => ({clzMethod: '__LOGGER'})})) as unknown as jest.Mock<typeof LoggerModule.Logger>
    loggerSpy = jest.mock('../logger') as unknown as jest.Mock<typeof LoggerModule.Logger>
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules() // lifesaver
  })

  it('attaches stackDriver transport when config specifies and is on server', () => {
    const mockConfig: Partial<Config> = {
      environment: {APP_ENV: 'local', CLIENT_SERVER: 'server', IS_E2E_TEST: false, GCE_PROJECT_ID: 'partridge-alan', GCE_KEY_FILENAME: '/path/to/filename.json'},
      logging: {level: 'warn', stackDriverEnable: true, consoleEnable: false}
    }
    jest.doMock('partridge-config', () => ({config: mockConfig, isServerSide: () => true}))
    
    require('../index')
    
    expect(stackDriverTransportSpy).toHaveBeenCalledTimes(1)
    expect(stackDriverTransportSpy.mock.calls[0][0]).toEqual(expect.objectContaining({projectId: 'partridge-alan', keyFilename: '/path/to/filename.json'})) // https://goo.gl/GLPD4j
    expect(winstonCreateLoggerSpy.mock.calls[0][0].transports).toContain(mockStackDriver)
  })
  
  it('does not attach stackDriver transport when config specifies on but not on server', () => {
    const mockConfig: Partial<Config> = {
      environment: {APP_ENV: 'local', CLIENT_SERVER: 'server', IS_E2E_TEST: false, GCE_PROJECT_ID: 'partridge-alan'},
      logging: {level: 'warn', stackDriverEnable: false, consoleEnable: false}
    }
    jest.doMock('partridge-config', () => ({config: mockConfig, isServerSide: () => false}))
    require('../index')
    
    expect(stackDriverTransportSpy).not.toHaveBeenCalled()
  })
  
  it('does not attach stackDriver transport when config specifies off', () => {
    const mockConfig: Partial<Config> = {
      environment: {APP_ENV: 'local', CLIENT_SERVER: 'server', IS_E2E_TEST: false, GCE_PROJECT_ID: 'partridge-alan'},
      logging: {level: 'warn', stackDriverEnable: false, consoleEnable: false}
    }
    jest.doMock('partridge-config', () => ({config: mockConfig, isServerSide: () => true}))
    require('../index')
    
    expect(stackDriverTransportSpy).not.toHaveBeenCalled()
  })
  
  it('Creates Logger instance', () => {
    const mockConfig: Partial<Config> = {
      environment: {APP_ENV: 'local', CLIENT_SERVER: 'server', IS_E2E_TEST: false, GCE_PROJECT_ID: 'partridge-alan'},
      logging: {level: 'warn', stackDriverEnable: false, consoleEnable: false}
    }
    jest.doMock('partridge-config', () => ({config: mockConfig, isServerSide: () => true}))
    
    require('../index')
    
    expect(loggerSpy.mock.calls[0][0]).toEqual(expect.objectContaining({on: loggerOnMock}))
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
