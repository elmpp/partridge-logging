"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_request_1 = __importDefault(require("org-common/lib/formatters/axios-request"));
const axios_response_1 = __importDefault(require("org-common/lib/formatters/axios-response"));
const axios_error_1 = __importDefault(require("org-common/lib/formatters/axios-error"));
function isAxiosRequest(dumpableKey, _dumpable) {
    return dumpableKey === 'axiosRequest';
}
function isAxiosResponse(dumpableKey, _dumpable) {
    return dumpableKey === 'axiosResponse';
}
function isAxiosError(dumpableKey, _dumpable) {
    return dumpableKey === 'axiosError';
}
const format = (dumpableKey, dumpable, logLevel) => {
    if (isAxiosRequest(dumpableKey, dumpable)) {
        return axios_request_1.default(dumpable, logLevel);
    }
    if (isAxiosResponse(dumpableKey, dumpable)) {
        return axios_response_1.default(dumpable, logLevel);
    }
    if (isAxiosError(dumpableKey, dumpable)) {
        return axios_error_1.default(dumpable, logLevel);
    }
    if (typeof dumpable.asFormat === 'function') {
        return dumpable.asFormat(logLevel);
    }
    return dumpable;
};
exports.default = format;
//# sourceMappingURL=format.js.map