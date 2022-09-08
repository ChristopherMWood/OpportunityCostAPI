import { NextFunction, Request, Response } from 'express';
import logger from "../logger.js";
 
const logError = ((err: any, req: Request, res: Response, next: NextFunction) => {
    let method = req.method
    let url = req.url
    let status = res.statusCode
 
    logger.error({ message: `method=${method} url=${url} status=${status} error=${err.stack}`, labels: { 'origin': 'api' } })
    next()
})

export default logError;