import {Logger} from '../logger'
import * as formatModule from '../format'
import {Dumpables, LogOptions} from '../__types__'

describe('logger', () => {
  const winstonLoggerMock = {log: jest.fn()} as any
  const logger = new Logger(winstonLoggerMock, 'warn')
  const formatter = jest.spyOn(formatModule, 'default')
  const axiosRequestMock = {
    url: 'http://bbc.com',
    headers: {
      'x-feed-supplier': 'coral',
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
})
