"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_request_1 = __importDefault(require("org-common/src/formatters/axios-request"));
const axios_response_1 = __importDefault(require("org-common/src/formatters/axios-response"));
const format = (dumpableKey, dumpable, logLevel) => {
    switch (dumpableKey) {
        case 'axiosRequest':
            return axios_request_1.default(dumpable, logLevel);
            break;
        case 'axiosResponse':
            return axios_response_1.default(dumpable, logLevel);
            break;
        default:
            return dumpable;
    }
};
exports.default = format;
//# sourceMappingURL=format.js.map