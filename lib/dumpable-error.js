export class DumpableError extends Error {
    constructor(message, dumpables) {
        super(message);
        this.dumpables = dumpables;
    }
}
//# sourceMappingURL=dumpable-error.js.map