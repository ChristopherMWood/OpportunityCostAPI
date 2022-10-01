import dotenv from 'dotenv'
dotenv.config()

import express, { NextFunction, Request, Response } from 'express';
import { collectDefaultMetrics, register } from 'prom-client';
import cors from 'cors'
import bodyParser from 'body-parser'
import logResponseTime from './middleware/responseTimeLogger.js'
import errorLogger from './middleware/errorLogger.js'
import responseTime from 'response-time'
import apiRoutes from './api/routes.js'
import mongo from './database.js';
import logger from './logger.js'

if (!process.env.GOOGLE_API_KEY) {
	throw new Error('ERROR: GOOGLE_API_KEY environment variable has not been correctly set!')
}

logger.info(`Server booting in: ${process.env.NODE_ENV} mode`)
collectDefaultMetrics();
mongo.init();

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use(function(req: Request, res: Response, next: NextFunction) {
	res.type('application/json')
    next();
});

app.use(responseTime(logResponseTime));

const apiRouteRequestLogging = (req: Request, _res: Response, next: NextFunction) => {
	const requestedEndpoint = req.protocol + '://' + req.get('Host') + req.url
	logger.info(`API Request: ${requestedEndpoint}`)
	next()
}

app.use('/api', apiRouteRequestLogging, apiRoutes)

app.use(errorLogger);
// app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
// 	if (res.headersSent) {
// 		return next(err)
// 	}

// 	logger.error('Unhandled Exception Caught: ' + err.message)
// 	res.status(500).send('An unhandled error occured')
// })

app.get('/metrics', async (_req, res) => {
	try {
	  res.set('Content-Type', register.contentType);
	  res.end(await register.metrics());
	} catch (err) {
	  res.status(500).end(err);
	}
  });

const server = app.listen(process.env.SERVER_PORT, () => {
	logger.info(`Server running on port ${process.env.SERVER_PORT}...`)
})

const handleShutDown = (signal: Number) => {
	logger.info(`Received ${signal}. Shutting down server.`)

	server.close(() => {
		process.exit(0);
	});
}

process.on('SIGINT', handleShutDown);
process.on('SIGQUIT', handleShutDown);
process.on('SIGTERM', handleShutDown);