import {AxiosRequestConfig, AxiosResponse} from 'axios'
import winston from 'winston'

export interface Dumpables {
  axiosRequest?: AxiosRequestConfig[]
  axiosResponse?: AxiosResponse[]
  [index: string]: any
}
export type Dumpable = AxiosRequestConfig | AxiosResponse
export type DumpableKey = 'axiosRequest' | 'axiosResponse' | string

export type LoggingProvider = winston.Logger

// RFC5424 - https://goo.gl/SKwCso
export type LogLevel = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug'

export type Formatter = (_x: Dumpable, logLevel: LogLevel) => object