"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DumpableError extends Error {
    constructor(message, dumpables) {
        super(message);
        this.dumpables = dumpables;
    }
}
exports.DumpableError = DumpableError;
//# sourceMappingURL=dumpable-error.js.map