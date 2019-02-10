import axiosRequestFormatter from 'org-common/lib/formatters/axios-request'
import axiosResponseFormatter from 'org-common/lib/formatters/axios-response'
import {Dumpable, DumpableKey, LogLevel} from './__types__'
import { AxiosRequestConfig, AxiosResponse } from "axios";

function isAxiosRequest(dumpableKey: DumpableKey, _dumpable: Dumpable): _dumpable is AxiosRequestConfig {
  return dumpableKey === 'axiosRequest'
}
function isAxiosResponse(dumpableKey: DumpableKey, _dumpable: Dumpable): _dumpable is AxiosResponse {
  return dumpableKey === 'axiosResponse'
}

const format = (dumpableKey: DumpableKey, dumpable: Dumpable, logLevel: LogLevel): any => {
  if (isAxiosRequest(dumpableKey, dumpable)) {
    return axiosRequestFormatter(dumpable, logLevel)
  }
  if (isAxiosResponse(dumpableKey, dumpable)) {
    return axiosResponseFormatter(dumpable, logLevel)
  }
  
  if (typeof dumpable.asFormat === 'function') {
    return dumpable.asFormat(logLevel)
  }

  return dumpable
}

export default format
