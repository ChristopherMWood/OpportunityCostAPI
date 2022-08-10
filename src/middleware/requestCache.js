import ExpressRedisCache from 'express-redis-cache'
import logger from '../logger.js'

const cache = ExpressRedisCache({
	host: 'redis',
	expire: 60 * 10,
})

const requestCache = cache.route()

export default requestCache