import { Dumpables } from "./__types__";
export default class DumpableError extends Error {
    readonly dumpables: Dumpables;
    constructor(message: string, dumpables: Dumpables);
}
//# sourceMappingURL=dumpable-error.d.ts.map