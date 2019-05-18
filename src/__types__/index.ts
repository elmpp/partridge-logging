import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios'
import winston from 'winston'

export interface Dumpables {
  axiosRequest?: AxiosRequestConfig[]
  axiosResponse?: AxiosResponse[]
  [index: string]: any[] | undefined
}
export type Dumpable = AxiosRequestConfig | AxiosResponse | AxiosError | Formattable
export type DumpableKey = 'axiosRequest' | 'axiosResponse' | 'axiosError' | string

export type LoggingProvider = winston.Logger

// // https://goo.gl/MLZ3nQ
// export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

export interface LogOptions {
  dumpables?: Dumpables
  runtime_label: 'APOLLO' | 'BOOTSTRAP' | 'AXIOS' | 'IMPORTER' | 'EXPRESS' | 'FRONTEND' | 'TYPEORM'
  labels?: object
  [index: string]: any
}
