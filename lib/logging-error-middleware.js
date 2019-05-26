"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const object_1 = require("org-common/lib/object");
const logging = (err, req, res, next) => {
    const httpRequest = object_1.filter({
        status: res.statusCode,
        requestUrl: req.url,
        requestMethod: req.method,
        userAgent: req.headers["user-agent"],
        remoteIp: req.connection.remoteAddress,
        referer: req.headers.referer,
        cacheHit: req.headers["X-Cache"],
    }, Boolean);
    _1.default.log('error', err, {
        httpRequest,
        dumpables: {
            httpRequest: [httpRequest],
        },
        runtime_label: 'EXPRESS',
    });
    next(err);
};
exports.middleware = logging;
const applyMiddleware = ({ app }) => {
    app.use(logging);
};
exports.apply = applyMiddleware;
//# sourceMappingURL=logging-error-middleware.js.map