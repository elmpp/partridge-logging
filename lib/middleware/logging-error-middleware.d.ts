import express from 'express';
declare const logging: (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => void;
declare const applyMiddleware: ({ app }: {
    app: express.Application;
}) => void;
export { applyMiddleware as apply, logging as middleware, };
//# sourceMappingURL=logging-error-middleware.d.ts.map