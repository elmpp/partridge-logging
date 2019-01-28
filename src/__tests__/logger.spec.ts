import {Logger, LogOptions} from '../logger'

describe('logger', () => {
  const winstonLoggerMock = {log: jest.fn()} as any
  const logger = new Logger(winstonLoggerMock, 'warning')

  it('delegates calls to the (winston) logging provider', () => {
    const axiosRequestMock = {
      url: 'http://bbc.com',
      headers: {
        'x-feed-supplier': 'coral',
      },
    }

    const logOptions: LogOptions = {runtime_label: 'AXIOS', dumpables: {axiosRequest: [axiosRequestMock]}}
    logger.log('error', 'Test Message', logOptions)

    expect(winstonLoggerMock.log).toHaveBeenCalled()
    expect(winstonLoggerMock.log.mock.calls[0][0]).toHaveProperty('level', 'error')
    expect(winstonLoggerMock.log.mock.calls[0][0]).toHaveProperty('runtime_label', logOptions.runtime_label)
    expect(winstonLoggerMock.log.mock.calls[0][0]).toHaveProperty('dumpables', logOptions.dumpables)
    expect(winstonLoggerMock.log.mock.calls[0][0]).toHaveProperty('message')
  })
})
