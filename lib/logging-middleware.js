"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("./"));
const logging = (req, res, next) => {
    _1.default.log('info', `${req.url} endpoint hit`, {
        httpRequest: {
            status: res.statusCode,
            requestUrl: req.url,
            requestMethod: req.method,
            userAgent: req.headers["user-agent"],
            remoteIp: req.connection.remoteAddress,
            referer: req.headers.referer,
            cacheHit: req.headers["X-Cache"],
        },
        runtime_label: 'EXPRESS',
    });
    next();
};
exports.middleware = logging;
const applyMiddleware = ({ app }) => {
    app.use(logging);
};
exports.apply = applyMiddleware;
//# sourceMappingURL=logging-middleware.js.map