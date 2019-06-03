import {Logger} from '../logger'
import * as formatModule from '../format'
import {Dumpables, LogOptions} from '../__types__'
import {FeedSupplierName} from 'partridge-config'

describe('logger', () => {
  const winstonLoggerMock: any = {log: jest.fn()}
  const logger = new Logger(winstonLoggerMock, 'warn')
  const formatter = jest.spyOn(formatModule, 'default')
  const axiosRequestMock = {
    url: 'http://bbc.com',
    headers: {
      'x-feed-supplier': FeedSupplierName.coral,
    },
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('delegates calls to the (winston) logging provider', () => {
    const logOptions: LogOptions = {runtime_label: 'AXIOS', dumpables: {axiosRequest: [axiosRequestMock]}}
    logger.log('error', 'Test Message', logOptions)

    expect(winstonLoggerMock.log).toHaveBeenCalled()
    expect(winstonLoggerMock.log.mock.calls[0][0]).toEqual('error')
    expect(winstonLoggerMock.log.mock.calls[0][1]).toEqual('Test Message')
    expect(winstonLoggerMock.log.mock.calls[0][2]).toHaveProperty('runtime_label', logOptions.runtime_label)
  })

  it('invokes the formatters on the dumpables if supplied', () => {
    const dumpables: Dumpables = {axiosRequest: [axiosRequestMock]}
    const logOptions: LogOptions = {runtime_label: 'AXIOS', dumpables}
    logger.log('error', 'Test Message', logOptions)

    expect(formatter).toHaveBeenLastCalledWith('axiosRequest', axiosRequestMock, 'error')
    expect(winstonLoggerMock.log.mock.calls[0][2]).toHaveProperty('dumpables', {axiosRequest: axiosRequestMock}) // removes the array when singular
  })

  it('overloads the log method correctly', () => {
    logger.log('error', 'Test Message')

    expect(winstonLoggerMock.log.mock.calls[0][2]).toEqual({})
  })

  it('handles grpc errors and just re-logs with message', () => {
    // e.g. - https://goo.gl/8NPfKG
    const logMsg = 'Stupidly large log message'
    const grpcErrorMsg = 'Log entry with size 175.9K exceeds maximum size of 110.0K'
    winstonLoggerMock.log.mockImplementationOnce(() => {
      throw new Error(grpcErrorMsg)
    })
    logger.log('debug', logMsg, {
      runtime_label: 'AXIOS',
      dumpables: {response: ['stupidly large data bit, for instance']},
    })

    expect(winstonLoggerMock.log).toHaveBeenLastCalledWith(
      'error',
      new Error(grpcErrorMsg),
    )
  })

  it('allows logging of Error objects', () => {
    const dumpables: Dumpables = {axiosRequest: [axiosRequestMock]}
    const logOptions: LogOptions = {runtime_label: 'AXIOS', dumpables}
    const testError = new Error('non-enumerable Error object needs printing')
    logger.log('error', testError, logOptions)

    expect(winstonLoggerMock.log.mock.calls[0][1]).toEqual(testError)
  })
})
