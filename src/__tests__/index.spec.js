import configModule from 'partridge-config'

describe('partridge-logging-index', () => {
  let configMock
  beforeEach(() => {
    console.log('configModule :', configModule);
    // configSpy = jest.spyOn(configModule, 'default').mockImplementation(() => ({logging: {stackDriverEnable: false}}))
    configMock = jest.mock(configModule, () => ({logging: {stackDriverEnable: false}}))
  })
  it('attaches stackDriver transport when config specifies', () => {
    configMock.mockImplementation(() => ({logging: {stackDriverEnable: true}}))
    // const stackDriverMock = jest.mock('@google-cloud/logging-winston')

    expect(1).toEqual(1)
  })
})
