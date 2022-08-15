import express, { Request, Response } from 'express'
// import requestCache from '../middleware/requestCache.js'
import opportunityCostApiRoutes from './opportunityCostApi/routes.js'
import healthCheckRoutes from './healthCheckApi/routes.js'

const router = express.Router()

// router.use('/opportunityCost', requestCache, opportunityCostApiRoutes) //USE THIS FOR CACHING
router.use('/opportunityCost', opportunityCostApiRoutes)
router.use('/health-check', healthCheckRoutes)

router.get('*', (_req: Request, res: Response) => {
	res.status(400)
	res.send()
})

export default router