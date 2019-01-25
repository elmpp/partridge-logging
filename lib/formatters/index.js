import axiosRequestFormatter from './axios-request';
const format = (dumpableKey, dumpable, logLevel) => {
    switch (dumpableKey) {
        case 'axiosRequest':
            return axiosRequestFormatter(dumpable, logLevel);
            break;
        default:
            return JSON.stringify(dumpable);
    }
};
export default format;
//# sourceMappingURL=index.js.map