/**
 * express middleware - https://goo.gl/iY2tDD
 */
import express from 'express'
import logger from '../'
import {filter} from 'org-common/lib/object'


const logging = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  
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
  logger.log('info', `${req.url} endpoint hit`, {
    httpRequest, // "proto" key in stackdriver - https://tinyurl.com/y5rftcgy
    dumpables: {
      httpRequest: [httpRequest],
    },
    runtime_label: 'EXPRESS',
  })

  next()
}

const applyMiddleware = ({app}: {app: express.Application}) => {
  app.use(logging)
}

export {
  applyMiddleware as apply,
  logging as middleware,
}