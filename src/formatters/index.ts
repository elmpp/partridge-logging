import axiosRequestFormatter from './axios-request'
import {Dumpable, DumpableKey, LogLevel} from '../__types__'
import DumpableError from '../dumpable-error';

const format = (dumpableKey: DumpableKey, dumpable: Dumpable, logLevel: LogLevel) => {
  switch (dumpableKey) {
    case 'axiosRequest':
      return axiosRequestFormatter(dumpable, logLevel)
      break
    // case 'axiosResponse':
    //   break
    default: 
      // throw new DumpableError('Unrecognised dumpable')
      return JSON.stringify(dumpable)
  }
}

export default format
