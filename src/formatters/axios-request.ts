import { Formatter, LogLevel } from "../__types__";
import { AxiosRequestConfig } from "axios";
import pick from 'lodash.pick'

const formatter: Formatter =  (dumpable: AxiosRequestConfig, _logLevel: LogLevel) => {
  const vals = pick(dumpable, ['url', 'headers'])
  return JSON.stringify(vals)
}

export default formatter