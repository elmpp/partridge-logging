import {AxiosRequestConfig, AxiosResponse} from 'axios'
import winston from 'winston'
import {Formattable} from 'org-common/src/__types__/formatters'

export interface Dumpables {
  axiosRequest?: AxiosRequestConfig[]
  axiosResponse?: AxiosResponse[]
  [index: string]: any
}
export type Dumpable = AxiosRequestConfig | AxiosResponse | Formattable
export type DumpableKey = 'axiosRequest' | 'axiosResponse' | string

export type LoggingProvider = winston.Logger

// https://goo.gl/MLZ3nQ
export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

export interface LogOptions {
  dumpables?: Dumpables
  runtime_label: 'APOLLO' | 'BOOTSTRAP' | 'AXIOS' | 'IMPORTER' | ''
  labels?: object
  [index: string]: any
}
