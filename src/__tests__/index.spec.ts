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
    jest.doMock("config", () => ({get: () => true}))
    require("../index")
    
    expect(stackDriverTransportSpy).toHaveBeenCalled()
    expect(createLoggerSpy.mock.calls[0][0].transports).toContain(mockStackDriver)
  })
  
  it("attaches stackDriver transport when config specifies off", () => {
    jest.doMock("partridge-config", () => ({get: () => false}))
    require("../index")

    expect(stackDriverTransportSpy).not.toHaveBeenCalled()
  })
})
