import dotenv from 'dotenv'
dotenv.config()

import express, { Express, NextFunction, Request, Response, Router } from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import responseTime from 'response-time'
import apiRoutes from './api/routes.js'
import mongo from './database.js';
import logger from './logger.js'

logger.info(`Server running in: ${process.env.NODE_ENV} mode`)

if (!process.env.GOOGLE_API_KEY) {
	throw new Error('ERROR: GOOGLE_API_KEY environment variable has not been correctly set!')
}

mongo.init();

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use(responseTime(function (req: Request, _res: Response, time: Number) {
	logger.info(`[PERFORMANCE - ${time}ms: ${req.method + req.url}`)
}))

const apiRouteRequestLogging = (req: Request, _res: Response, next: NextFunction) => {
	const requestedEndpoint = req.protocol + '://' + req.get('Host') + req.url
	logger.info(`API Request: ${requestedEndpoint}`)
	next()
}

app.use('/api', apiRouteRequestLogging, apiRoutes)

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
	logger.error(err)

	if (res.headersSent) {
		return next(err)
	}

	res.status(500).send('An unhandled error occured')
})

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