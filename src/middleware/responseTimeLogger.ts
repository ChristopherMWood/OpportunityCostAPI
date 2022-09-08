import { Request, Response } from 'express';
import logger from "../logger.js";
 
const logResponseTime = (req: Request, res: Response, time: Number) => {
    let method = req.method
    let url = req.url
    let status = res.statusCode
 
  logger.info({ message: `method=${method} url=${url} status=${status} duration=${time}ms`, labels: { 'origin': 'api' } })
}

export default logResponseTime;