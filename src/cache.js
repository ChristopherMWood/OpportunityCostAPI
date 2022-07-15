import ExpressRedisCache from 'express-redis-cache'

let cacheRoute

if (process.env.NODE_ENV === 'production') {
	const cache = ExpressRedisCache({
		expire: 60 * 10,
	})

	cacheRoute = cache.route()
} else {
	cacheRoute = (req, res, next) => { next() }
}

export default cacheRoute