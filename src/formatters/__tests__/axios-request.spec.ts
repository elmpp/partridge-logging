import { AxiosRequestConfig } from "axios";
import format from '../axios-request'
import pick from 'lodash.pick'

describe('axios-request', () => {
  it('formats an instance of AxiosRequestConfig', () => {
    const dumpable: AxiosRequestConfig = {
      url: 'http://bbc.com',
      headers: {
        'x-feed-supplier': 'coral',
        'Accept': 'application/json',
      },
      maxContentLength: 9999,
    }
    const expected = pick(dumpable, ['url', 'headers'])

    const formatted = format(dumpable, 'warn')

    expect(formatted).toEqual(expect.objectContaining(expected))
  })
})