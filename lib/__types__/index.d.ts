import { AxiosRequestConfig, AxiosResponse } from 'axios';
import winston from 'winston';
export interface Dumpables {
    axiosRequest?: AxiosRequestConfig[];
    axiosResponse?: AxiosResponse[];
    [index: string]: any;
}
export declare type Dumpable = AxiosRequestConfig | AxiosResponse;
export declare type DumpableKey = 'axiosRequest' | 'axiosResponse' | string;
export declare type LoggingProvider = winston.Logger;
export declare type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
export declare type Formatter = (_x: Dumpable, logLevel: LogLevel) => object;
//# sourceMappingURL=index.d.ts.map