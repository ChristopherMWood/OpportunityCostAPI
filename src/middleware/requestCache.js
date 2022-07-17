import ExpressRedisCache from 'express-redis-cache'

let requestCache

if (process.env.NODE_ENV === 'production') {
	const cache = ExpressRedisCache({
		expire: 60 * 10,
	})

	requestCache = cache.route()
} else {
	requestCache = (req, res, next) => { next() }
}

export default requestCache