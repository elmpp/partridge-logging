// import configModule = require('partridge-config')
// import * as configModule from 'partridge-config'


describe('partridge-logging-index', () => {
  
  let stackDriverSpy

  beforeEach(() => {
    stackDriverSpy = jest.fn(() => ({}))

    jest.genMockFromModule('@google-cloud/logging-winston')
    const winstonLoggingModule = require('@google-cloud/logging-winston')
    winstonLoggingModule.mockImplementation(stackDriverSpy)
  })
  
  it('attaches stackDriver transport when config specifies', () => {
    jest.doMock('partridge-config', () => ({logging: {stackDriverEnable: true}}))
    const configModule = require('partridge-config')
    require('../index')
    
    console.log('configModule :', configModule);

    expect(stackDriverSpy).toHaveBeenCalled()
  })
})
