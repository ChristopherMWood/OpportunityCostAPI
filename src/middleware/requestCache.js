import ExpressRedisCache from 'express-redis-cache'
import logger from '../logger.js'
import dotenv from 'dotenv'

dotenv.config()

let requestCache

if (process.env.NODE_ENV === 'production') {
	logger.info('Caching ENABLED for requests')
	const cache = ExpressRedisCache({
		host: 'redis',
		expire: 60 * 10,
	})

	requestCache = cache.route()
} else {
	logger.info('Caching DISABLED for requests')
	requestCache = (req, res, next) => { next() }
}

export default requestCache