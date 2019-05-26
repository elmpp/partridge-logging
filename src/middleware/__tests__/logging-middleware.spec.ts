import express from 'express'
import nodeMocks from 'node-mocks-http' // https://goo.gl/BsbPp7
import {apply as applyLoggingMiddlware, middleware as loggingMiddleware} from '../logging-middleware'
const {log: mockedLogger} = jest.requireMock('../../')

jest.mock('../../', () => ({log: jest.fn()}))

describe('logging-middleware', () => {

  const expressApp = {
    use: jest.fn(),
    listen: jest.fn()
  }
  jest.doMock('express', () => {
    return () => {
      return expressApp
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('applies itself to the express application', () => {
    applyLoggingMiddlware({app: expressApp as any as express.Application})
    
    expect(expressApp.use).toHaveBeenCalled()
    expect(expressApp.use.mock.calls[0][0]).toEqual(loggingMiddleware)
  })
  
  it('logs requests', () => {

    const reqMock = nodeMocks.createRequest({url: 'www.bbc.com'})
    reqMock.headers = {['X-Cache']: 'HIT', 'user-agent': 'total random unknown device'}
    reqMock.connection = {remoteAddress: '8.8.8.8'} as any
    const resMock = nodeMocks.createResponse()
    const nextMock = jest.fn()

    const expectedHttpRequest = { // https://goo.gl/njizbV / https://goo.gl/LwEpWa (camelcased though)
      status: resMock.statusCode,
      requestUrl: reqMock.url,
      requestMethod: reqMock.method,
      userAgent: reqMock.headers["user-agent"],
      remoteIp: reqMock.connection.remoteAddress,
      cacheHit: reqMock.headers["X-Cache"],
    }

    loggingMiddleware(reqMock, resMock, nextMock)

    expect(mockedLogger).toHaveBeenCalled()
    expect(mockedLogger.mock.calls[0][0]).toEqual('info')
    expect(mockedLogger.mock.calls[0][1]).toEqual(`${reqMock.url} endpoint hit`)
    expect(mockedLogger.mock.calls[0][2].httpRequest).toEqual(expect.objectContaining(expectedHttpRequest))
    expect(mockedLogger.mock.calls[0][2].dumpables).toEqual(expect.objectContaining({httpRequest: [expectedHttpRequest]}))
    
    expect(nextMock).toHaveBeenCalled()
  })
})