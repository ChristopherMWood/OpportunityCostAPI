import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import responseTime from 'response-time'
import cors from 'cors'
import apiRoutes from './api/routes.js'
import logger from './logger.js'
import { MongoClient } from 'mongodb'

logger.info(`Server running in: ${process.env.NODE_ENV} mode`)

const mongoConnectionString = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
const client = new MongoClient(mongoConnectionString);

try {
	await client.connect();
	console.log("Connected successfully to MongoDB Server");
} catch {
	console.error("Error connecting to Mongo DB");
	process.exit(0);
}

if (!process.env.GOOGLE_API_KEY) {
	throw new Error('ERROR: GOOGLE_API_KEY environment variable has not been correctly set!')
}

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use(responseTime(function (req, res, time) {
	logger.info(`[PERFORMANCE - ${time}ms: ${req.method + req.url}`)
  }))

const apiRouteRequestLogging = (req, res, next) => {
	const requestedEndpoint = req.protocol + '://' + req.get('Host') + req.url
	logger.info(`API Request: ${requestedEndpoint}`)
	next()
}

app.use('/api', apiRouteRequestLogging, apiRoutes)

/* Global Error Handler */
app.use((err, req, res, next) => {
	logger.error(err)
	res.status(500).send('An unknown error occured')
	next() //I think this is needed <-------check
})

app.locals.db = client.db();
app.listen(process.env.SERVER_PORT, () => {
	logger.info(`Server running on port ${process.env.SERVER_PORT}...`)
})

function handleExit(signal) {
	logger.info(`Received ${signal}. Shutting down server.`)

    client.close();
	app.close(function () {
		process.exit(0);
	});
}

process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
process.on('SIGTERM', handleExit);