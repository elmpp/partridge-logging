"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const formatter = (dumpable, _logLevel) => {
    const vals = lodash_pick_1.default(dumpable, ['url', 'headers']);
    return vals;
};
exports.default = formatter;
//# sourceMappingURL=axios-request.1.js.map