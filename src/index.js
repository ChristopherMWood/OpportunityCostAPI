import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import responseTime from 'response-time'
import cors from 'cors'
import apiRoutes from './api/routes.js'
import logger from './logger.js'
import { MongoClient } from 'mongodb'

//CHECK HOW TO MANAGE MONGO DB CONNECTIONS
const mongoConnectionString = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
const client = new MongoClient(mongoConnectionString);

async function TESTMONGOCONNECTION() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Server");
  } finally {
    await client.close();
  }
}
TESTMONGOCONNECTION().catch(console.dir);

logger.info(`Runtime Environment: ${process.env.NODE_ENV}`)

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

const port = 8080

app.listen(port, () => {
	logger.info(`Server running on port ${port}...`)
})