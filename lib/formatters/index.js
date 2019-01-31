"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_request_1 = __importDefault(require("./axios-request"));
const format = (dumpableKey, dumpable, logLevel) => {
    switch (dumpableKey) {
        case 'axiosRequest':
            return axios_request_1.default(dumpable, logLevel);
            break;
        default:
            return JSON.stringify(dumpable);
    }
};
exports.default = format;
//# sourceMappingURL=index.js.map