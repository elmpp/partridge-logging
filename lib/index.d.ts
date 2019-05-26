export { default as DumpableError } from './dumpable-error';
import { Logger } from './logger';
export * from './__types__';
import { apply, middleware } from './logging-middleware';
declare const logger: Logger;
export default logger;
export { Logger, apply, middleware, };
//# sourceMappingURL=index.d.ts.map