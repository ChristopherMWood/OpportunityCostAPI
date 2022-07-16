import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRoutes from './api/routes.js'
import logger from './logger.js'

dotenv.config()

if (!process.env.PORT || !process.env.GOOGLE_API_KEY) {
	throw new Error('ERROR: PORT or GOOGLE_API_KEY environment variable has not been correctly set!')
}
const app = express()
app.use(cors())
app.use(bodyParser.json())

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

app.listen(process.env.PORT, () => {
	logger.info(`Server running on port ${process.env.PORT}...`)
})