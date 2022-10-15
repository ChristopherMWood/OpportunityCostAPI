import express, { Request, Response } from 'express'
import logger from '../logger.js'
// import requestCache from '../middleware/requestCache.js'
import opportunityCostApiRoutes from './opportunityCostApi/routes.js'

const router = express.Router()

// router.use('/opportunityCost', requestCache, opportunityCostApiRoutes) //USE THIS FOR CACHING
router.use('/opportunityCost', opportunityCostApiRoutes)

router.get('/health-ping', (_req: Request, res: Response) => {
	res.status(200)
	res.send(JSON.stringify({
		otc: "the rooster is healthy on full nights orange"
	}))
})

router.get('*', (_req: Request, res: Response) => {
	res.status(400)
	res.send()
})

export default router