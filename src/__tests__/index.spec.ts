import * as StackDriverModule from "@google-cloud/logging-winston" // https://goo.gl/wcwLaK
import * as WinstonModule from 'winston'

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

  it("attaches stackDriver transport when config specifies", () => {
    jest.doMock("partridge-config", () => ({logging: {stackDriverEnable: true}}))
    require("../index")

    expect(stackDriverTransportSpy).toHaveBeenCalled()
    expect(createLoggerSpy.mock.calls[0][0].transports).toContain(mockStackDriver)
  })
  
  it("attaches stackDriver transport when config specifies", () => {
    jest.doMock("partridge-config", () => ({logging: {stackDriverEnable: false}}))
    require("../index")

    expect(stackDriverTransportSpy).not.toHaveBeenCalled()
  })
})
