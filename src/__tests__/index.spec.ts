// import winston from 'winston'
import winston from 'winston'
import * as StackDriverModule from "@google-cloud/logging-winston" // https://goo.gl/wcwLaK
import {Config} from 'partridge-config'


describe("partridge-logging-index", () => {
  let stackDriverTransportSpy: any
  let mockStackDriver: any
  let createLoggerSpy: any

  beforeEach(() => {
    mockStackDriver = new StackDriverModule.LoggingWinston()
    stackDriverTransportSpy = jest.fn(() => mockStackDriver)
    jest.spyOn(StackDriverModule, "LoggingWinston").mockImplementation(stackDriverTransportSpy)
    createLoggerSpy = jest.spyOn(winston, "createLogger").mockImplementation(() =>({}))
  });
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("attaches stackDriver transport when config specifies on", () => {
    const mockConfig: Partial<Config> = {logging: {stackDriverEnable: true, consoleEnable: false}}
    jest.doMock("partridge-config", () => ({config: mockConfig}))
    require("../index")
    
    expect(stackDriverTransportSpy).toHaveBeenCalledTimes(1)
    expect(createLoggerSpy.mock.calls[0][0].transports).toContain(mockStackDriver)
  })
  
  it("does not attach stackDriver transport when config specifies off", () => {
    const mockConfig: Partial<Config> = {logging: {stackDriverEnable: false, consoleEnable: false}}
    jest.doMock("partridge-config", () => ({config: mockConfig}))
    require("../index")
    
    expect(stackDriverTransportSpy).not.toHaveBeenCalled()
  })
  
  // it("attaches console transport when config specifies on", () => {
  //   const mockConfig: Partial<Config> = {logging: {stackDriverEnable: true, consoleEnable: true}}
  //   jest.doMock("partridge-config", () => ({config: mockConfig}))
  //   require("../index")
  //   expect(createLoggerSpy.mock.calls[0][0].transports[0]).toBeInstanceOf(winston.transports.Console)
  // })
})
