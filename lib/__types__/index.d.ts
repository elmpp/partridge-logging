import { AxiosRequestConfig, AxiosResponse } from 'axios';
import winston from 'winston';
import { Formattable } from 'org-common/src/__types__/formatters';
export interface Dumpables {
    axiosRequest?: AxiosRequestConfig[];
    axiosResponse?: AxiosResponse[];
    [index: string]: any;
}
export declare type Dumpable = AxiosRequestConfig | AxiosResponse | Formattable;
export declare type DumpableKey = 'axiosRequest' | 'axiosResponse' | string;
export declare type LoggingProvider = winston.Logger;
export interface LogOptions {
    dumpables?: Dumpables;
    runtime_label: 'APOLLO' | 'BOOTSTRAP' | 'AXIOS' | 'IMPORTER' | '';
    labels?: object;
    [index: string]: any;
}
//# sourceMappingURL=index.d.ts.map