import {Logger} from '../logger'

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

    logger.log('error', 'Test Message', {label: 'AXIOS', dumpables: {axiosRequest: [axiosRequestMock]}})

    expect(winstonLoggerMock.log).toHaveBeenCalled()
    expect(winstonLoggerMock.log.mock.calls[0][0]).toHaveProperty('level', 'error')
    expect(winstonLoggerMock.log.mock.calls[0][0]).toHaveProperty('label', 'AXIOS')
    expect(winstonLoggerMock.log.mock.calls[0][0]).toHaveProperty('message')

    // it should have the dumpable at end of message as a json string
    const dumpableFormatted = JSON.parse(winstonLoggerMock.log.mock.calls[0][0].message.match(/^.+::: ({.*$)/)[1])

    expect(dumpableFormatted).toHaveProperty('axiosRequest')
    expect(dumpableFormatted.axiosRequest).toEqual(axiosRequestMock) // notice not an array for singular
  })
})
