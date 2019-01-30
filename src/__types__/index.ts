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

// https://goo.gl/MLZ3nQ
export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

export type Formatter = (_x: Dumpable, logLevel: LogLevel) => object