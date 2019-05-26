/**
 * express error handling middleware - https://tinyurl.com/y3j7ccnt
 */
import express from 'express'
import logger from '../'
import {filter} from 'org-common/lib/object'


const logging = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  
  const httpRequest = filter({
    status: res.statusCode,
    requestUrl: req.url,
    requestMethod: req.method,
    userAgent: req.headers["user-agent"],
    remoteIp: req.connection.remoteAddress,
    referer: req.headers.referer,
    cacheHit: req.headers["X-Cache"],
  }, Boolean)

  // please note there is an exclusion applied with StackDriver for /_next/xxx - http://tinyurl.com/y63csq3r
  logger.log('error', err, {
    httpRequest, // "proto" key in stackdriver - https://tinyurl.com/y5rftcgy
    dumpables: {
      httpRequest: [httpRequest],
    },
    runtime_label: 'EXPRESS',
  })

  next(err)
}

const applyMiddleware = ({app}: {app: express.Application}) => {
  app.use(logging)
}

export {
  applyMiddleware as apply,
  logging as middleware,
}