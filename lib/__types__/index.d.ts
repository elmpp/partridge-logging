import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import winston from 'winston';
export interface Dumpables {
    axiosRequest?: AxiosRequestConfig[];
    axiosResponse?: AxiosResponse[];
    [index: string]: any;
}
export declare type Dumpable = AxiosRequestConfig | AxiosResponse | AxiosError | Formattable;
export declare type DumpableKey = 'axiosRequest' | 'axiosResponse' | 'axiosError' | string;
export declare type LoggingProvider = winston.Logger;
export interface LogOptions {
    dumpables?: Dumpables;
    runtime_label: 'APOLLO' | 'BOOTSTRAP' | 'AXIOS' | 'IMPORTER' | 'EXPRESS' | 'FRONTEND' | 'TYPEORM';
    labels?: object;
    [index: string]: any;
}
//# sourceMappingURL=index.d.ts.map