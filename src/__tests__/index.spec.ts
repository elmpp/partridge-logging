import winston from 'winston'
import * as StackDriverModule from "@google-cloud/logging-winston" // https://goo.gl/wcwLaK
import WinstonModule from 'winston'

describe("partridge-logging-index", () => {
  let stackDriverTransportSpy: any
  let mockStackDriver: any
  let createLoggerSpy: any

  beforeEach(() => {
    mockStackDriver = new StackDriverModule.LoggingWinston()
    stackDriverTransportSpy = jest.fn(() => mockStackDriver)
    jest.spyOn(StackDriverModule, "LoggingWinston").mockImplementation(stackDriverTransportSpy)
    createLoggerSpy = jest.spyOn(WinstonModule, "createLogger")
  });

  it("attaches stackDriver transport when config specifies on", () => {
    const getMock = jest.fn()
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false)
    jest.doMock("config", () => ({get: getMock}))
    require("../index")
    
    expect(stackDriverTransportSpy).toHaveBeenCalledTimes(1)
    expect(createLoggerSpy.mock.calls[0][0].transports).toContain(mockStackDriver)
  })
  
  it("does not attach stackDriver transport when config specifies off", () => {
    jest.doMock("partridge-config", () => ({get: () => false}))
    require("../index")

    expect(stackDriverTransportSpy).not.toHaveBeenCalled()
  })

  it("attaches console transport when config specifies on", () => {
    const getMock = jest.fn()
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true)
    jest.doMock("config", () => ({get: getMock}))
    require("../index")
    
    expect(createLoggerSpy.mock.calls[0][0].transports[0]).toBeInstanceOf(winston.transports.Console)
  })
})
